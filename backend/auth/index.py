import json
import os

import boto3
import psycopg2


def _cors_headers() -> dict:
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
        'Access-Control-Max-Age': '86400',
    }


def _resp(status: int, body: dict) -> dict:
    return {
        'statusCode': status,
        'headers': {**_cors_headers(), 'Content-Type': 'application/json'},
        'isBase64Encoded': False,
        'body': json.dumps(body),
    }




def _db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def _token(event: dict) -> str:
    headers = event.get('headers') or {}
    return headers.get('X-Auth-Token') or headers.get('x-auth-token') or ''


def _delete_photos(uid: int) -> int:
    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    removed = 0
    for prefix in (f'private-photos/{uid}/', f'child-photos/{uid}/'):
        token = None
        while True:
            kwargs = {'Bucket': 'files', 'Prefix': prefix}
            if token:
                kwargs['ContinuationToken'] = token
            page = s3.list_objects_v2(**kwargs)
            for obj in page.get('Contents', []):
                s3.delete_object(Bucket='files', Key=obj['Key'])
                removed += 1
            if not page.get('IsTruncated'):
                break
            token = page.get('NextContinuationToken')
    return removed


def _delete_account(event: dict) -> dict:
    token = _token(event)
    if not token:
        return _resp(401, {'error': 'no_token'})
    conn = _db()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT u.id, u.phone FROM sessions s JOIN users u ON u.id = s.user_id "
            "WHERE s.token = %s AND s.expires_at > NOW()",
            (token,),
        )
        row = cur.fetchone()
        if not row:
            return _resp(401, {'error': 'invalid_token'})
        uid, phone = row
        photos = _delete_photos(uid)
        cur.execute("DELETE FROM user_children WHERE user_id = %s", (uid,))
        cur.execute("DELETE FROM sessions WHERE user_id = %s", (uid,))
        cur.execute("DELETE FROM auth_codes WHERE phone = %s", (phone,))
        cur.execute("DELETE FROM users WHERE id = %s", (uid,))
        conn.commit()
        return _resp(200, {'ok': True, 'photos_deleted': photos})
    finally:
        conn.close()


def handler(event: dict, context) -> dict:
    '''Личный кабинет: проверка текущего входа и полное удаление аккаунта с сервера. Вход по номеру телефона отключён.'''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors_headers(), 'isBase64Encoded': False, 'body': ''}

    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')

    if method == 'GET' and action == 'me':
        token = (event.get('headers') or {}).get('X-Auth-Token') or (event.get('headers') or {}).get('x-auth-token')
        if not token:
            return _resp(401, {'error': 'no_token'})
        conn = _db()
        try:
            cur = conn.cursor()
            cur.execute(
                "SELECT u.id, u.phone FROM sessions s JOIN users u ON u.id = s.user_id "
                "WHERE s.token = %s AND s.expires_at > NOW()",
                (token,),
            )
            row = cur.fetchone()
            if not row:
                return _resp(200, {'user': None})
            return _resp(200, {'user': {'id': row[0], 'phone': row[1]}})
        finally:
            conn.close()

    if method == 'DELETE' and action == 'account':
        return _delete_account(event)

    if action in ('request_code', 'verify_code'):
        return _resp(410, {'error': 'phone_login_disabled'})

    return _resp(400, {'error': 'unknown_action'})