import json
import os
import random
import secrets
from datetime import datetime, timedelta

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


def _normalize_phone(raw: str) -> str:
    digits = ''.join(ch for ch in str(raw) if ch.isdigit())
    if len(digits) == 11 and digits[0] == '8':
        digits = '7' + digits[1:]
    if len(digits) == 10:
        digits = '7' + digits
    return '+' + digits


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
    '''Авторизация родителя по номеру телефона: запрос кода, проверка кода, проверка сессии и полное удаление аккаунта с сервера.'''
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
                return _resp(401, {'error': 'invalid_token'})
            return _resp(200, {'user': {'id': row[0], 'phone': row[1]}})
        finally:
            conn.close()

    if method == 'DELETE' and action == 'account':
        return _delete_account(event)

    if method != 'POST':
        return _resp(405, {'error': 'method_not_allowed'})

    try:
        body = json.loads(event.get('body') or '{}')
    except Exception:
        return _resp(400, {'error': 'bad_json'})

    if action == 'request_code':
        phone = _normalize_phone(body.get('phone', ''))
        if len(phone) != 12:
            return _resp(400, {'error': 'invalid_phone'})
        code = f'{random.randint(0, 999999):06d}'
        expires = datetime.utcnow() + timedelta(minutes=5)
        conn = _db()
        try:
            cur = conn.cursor()
            cur.execute("UPDATE auth_codes SET used = TRUE WHERE phone = %s AND used = FALSE", (phone,))
            cur.execute(
                "INSERT INTO auth_codes (phone, code, expires_at) VALUES (%s, %s, %s)",
                (phone, code, expires),
            )
            conn.commit()
        finally:
            conn.close()
        return _resp(200, {'ok': True})

    if action == 'verify_code':
        phone = _normalize_phone(body.get('phone', ''))
        code = str(body.get('code', '')).strip()
        if len(phone) != 12 or not code:
            return _resp(400, {'error': 'invalid_input'})
        conn = _db()
        try:
            cur = conn.cursor()
            cur.execute(
                "SELECT id FROM auth_codes WHERE phone = %s AND code = %s AND used = FALSE "
                "AND expires_at > NOW() ORDER BY id DESC LIMIT 1",
                (phone, code),
            )
            row = cur.fetchone()
            if not row:
                return _resp(400, {'error': 'invalid_code'})
            cur.execute("UPDATE auth_codes SET used = TRUE WHERE id = %s", (row[0],))

            cur.execute("SELECT id FROM users WHERE phone = %s", (phone,))
            user = cur.fetchone()
            if user:
                user_id = user[0]
                cur.execute("UPDATE users SET last_login_at = NOW() WHERE id = %s", (user_id,))
            else:
                cur.execute(
                    "INSERT INTO users (phone, last_login_at) VALUES (%s, NOW()) RETURNING id",
                    (phone,),
                )
                user_id = cur.fetchone()[0]

            token = secrets.token_hex(32)
            expires = datetime.utcnow() + timedelta(days=30)
            cur.execute(
                "INSERT INTO sessions (token, user_id, expires_at) VALUES (%s, %s, %s)",
                (token, user_id, expires),
            )
            conn.commit()
            return _resp(200, {'ok': True, 'token': token, 'user': {'id': user_id, 'phone': phone}})
        finally:
            conn.close()

    return _resp(400, {'error': 'unknown_action'})