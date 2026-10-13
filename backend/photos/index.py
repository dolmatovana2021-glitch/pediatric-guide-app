import base64
import json
import os
import uuid

import boto3
import psycopg2

MAX_BYTES = 4 * 1024 * 1024
ALLOWED = {'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp'}


def _cors() -> dict:
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
        'Access-Control-Max-Age': '86400',
    }


def _resp(status: int, body: dict) -> dict:
    return {
        'statusCode': status,
        'headers': {**_cors(), 'Content-Type': 'application/json'},
        'isBase64Encoded': False,
        'body': json.dumps(body),
    }


def _user_id(token: str):
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()
        cur.execute("SELECT user_id FROM sessions WHERE token = %s AND expires_at > NOW()", (token,))
        row = cur.fetchone()
        return row[0] if row else None
    finally:
        conn.close()


def _s3():
    return boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )


def _cdn_prefix() -> str:
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/"


def handler(event: dict, context) -> dict:
    '''Загрузка и удаление фото к записям ребёнка (например, туберкулиновых проб) для авторизованного родителя.'''
    method = event.get('httpMethod', 'POST')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors(), 'isBase64Encoded': False, 'body': ''}

    headers = event.get('headers') or {}
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    if not token:
        return _resp(401, {'error': 'no_token'})
    uid = _user_id(token)
    if not uid:
        return _resp(401, {'error': 'invalid_token'})

    try:
        body = json.loads(event.get('body') or '{}')
    except Exception:
        return _resp(400, {'error': 'bad_json'})

    if method == 'POST':
        ctype = body.get('contentType') or 'image/jpeg'
        if ctype not in ALLOWED:
            return _resp(400, {'error': 'bad_type'})
        raw = body.get('image') or ''
        if ',' in raw[:100]:
            raw = raw.split(',', 1)[1]
        try:
            data = base64.b64decode(raw)
        except Exception:
            return _resp(400, {'error': 'bad_image'})
        if not data or len(data) > MAX_BYTES:
            return _resp(400, {'error': 'bad_size'})
        key = f"child-photos/{uid}/{uuid.uuid4().hex}.{ALLOWED[ctype]}"
        _s3().put_object(Bucket='files', Key=key, Body=data, ContentType=ctype)
        return _resp(200, {'url': _cdn_prefix() + key})

    if method == 'DELETE':
        url = body.get('url') or ''
        prefix = _cdn_prefix() + f"child-photos/{uid}/"
        if not url.startswith(prefix):
            return _resp(403, {'error': 'forbidden'})
        _s3().delete_object(Bucket='files', Key=url[len(_cdn_prefix()):])
        return _resp(200, {'ok': True})

    return _resp(405, {'error': 'method_not_allowed'})
