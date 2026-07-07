import json
import os
import random
import secrets
from datetime import datetime, timedelta

import psycopg2


def _cors_headers() -> dict:
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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


def handler(event: dict, context) -> dict:
    '''Авторизация родителя по номеру телефона: запрос кода, проверка кода, проверка сессии.'''
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
        return _resp(200, {'ok': True, 'demo_code': code})

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
