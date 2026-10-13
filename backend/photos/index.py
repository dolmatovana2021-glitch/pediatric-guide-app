import base64
import hashlib
import hmac
import json
import os
import uuid

import boto3
import psycopg2
from cryptography.fernet import Fernet, InvalidToken

MAX_BYTES = 4 * 1024 * 1024
ALLOWED = {'image/jpeg', 'image/png', 'image/webp'}
PRIV = 'priv:'


def _cors() -> dict:
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
        'Access-Control-Max-Age': '86400',
    }


def _resp(status: int, body: dict, extra: dict | None = None) -> dict:
    return {
        'statusCode': status,
        'headers': {**_cors(), 'Content-Type': 'application/json', **(extra or {})},
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


def _fernet(uid) -> Fernet:
    secret = os.environ['AWS_SECRET_ACCESS_KEY'].encode()
    key = hmac.new(secret, f'child-photo:{uid}'.encode(), hashlib.sha256).digest()
    return Fernet(base64.urlsafe_b64encode(key))


def _own_key(uid, ref: str):
    if not ref.startswith(PRIV):
        return None
    key = ref[len(PRIV):]
    if not key.startswith(f'private-photos/{uid}/') or '..' in key:
        return None
    return key


def _store(uid, data: bytes, ctype: str) -> str:
    key = f'private-photos/{uid}/{uuid.uuid4().hex}.bin'
    payload = json.dumps({'t': ctype}).encode() + b'\n' + data
    _s3().put_object(Bucket='files', Key=key, Body=_fernet(uid).encrypt(payload), ContentType='application/octet-stream')
    return PRIV + key


def _decode_image(raw: str) -> bytes:
    if ',' in raw[:100]:
        raw = raw.split(',', 1)[1]
    return base64.b64decode(raw)


def handler(event: dict, context) -> dict:
    '''Закрытое хранение фото к записям ребёнка: загрузка, просмотр и удаление только для вошедшего родителя. Файлы шифруются.'''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors(), 'isBase64Encoded': False, 'body': ''}

    headers = event.get('headers') or {}
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    if not token:
        return _resp(401, {'error': 'no_token'})
    uid = _user_id(token)
    if not uid:
        return _resp(401, {'error': 'invalid_token'})

    if method == 'GET':
        ref = (event.get('queryStringParameters') or {}).get('ref') or ''
        key = _own_key(uid, ref)
        if not key:
            return _resp(403, {'error': 'forbidden'})
        try:
            obj = _s3().get_object(Bucket='files', Key=key)
        except Exception:
            return _resp(404, {'error': 'not_found'})
        try:
            plain = _fernet(uid).decrypt(obj['Body'].read())
        except InvalidToken:
            return _resp(403, {'error': 'forbidden'})
        meta, data = plain.split(b'\n', 1)
        ctype = json.loads(meta).get('t', 'image/jpeg')
        return _resp(
            200,
            {'image': f'data:{ctype};base64,' + base64.b64encode(data).decode()},
            {'Cache-Control': 'private, no-store'},
        )

    try:
        body = json.loads(event.get('body') or '{}')
    except Exception:
        return _resp(400, {'error': 'bad_json'})

    if method == 'POST' and body.get('action') == 'migrate':
        url = body.get('url') or ''
        prefix = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/"
        old_key = url[len(prefix):] if url.startswith(prefix) else ''
        if not old_key.startswith(f'child-photos/{uid}/'):
            return _resp(403, {'error': 'forbidden'})
        s3 = _s3()
        try:
            obj = s3.get_object(Bucket='files', Key=old_key)
        except Exception:
            return _resp(404, {'error': 'not_found'})
        ref = _store(uid, obj['Body'].read(), obj.get('ContentType') or 'image/jpeg')
        s3.delete_object(Bucket='files', Key=old_key)
        return _resp(200, {'ref': ref})

    if method == 'POST':
        ctype = body.get('contentType') or 'image/jpeg'
        if ctype not in ALLOWED:
            return _resp(400, {'error': 'bad_type'})
        try:
            data = _decode_image(body.get('image') or '')
        except Exception:
            return _resp(400, {'error': 'bad_image'})
        if not data or len(data) > MAX_BYTES:
            return _resp(400, {'error': 'bad_size'})
        return _resp(200, {'ref': _store(uid, data, ctype)})

    if method == 'DELETE':
        key = _own_key(uid, body.get('ref') or '')
        if not key:
            return _resp(403, {'error': 'forbidden'})
        _s3().delete_object(Bucket='files', Key=key)
        return _resp(200, {'ok': True})

    return _resp(405, {'error': 'method_not_allowed'})
