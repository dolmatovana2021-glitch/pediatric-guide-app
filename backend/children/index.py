import json
import os

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


def _db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def _user_id(conn, token: str):
    cur = conn.cursor()
    cur.execute(
        "SELECT user_id FROM sessions WHERE token = %s AND expires_at > NOW()",
        (token,),
    )
    row = cur.fetchone()
    return row[0] if row else None


def handler(event: dict, context) -> dict:
    '''Облачное хранение профилей детей: загрузка и сохранение для авторизованного родителя.'''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors_headers(), 'isBase64Encoded': False, 'body': ''}

    headers = event.get('headers') or {}
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    if not token:
        return _resp(401, {'error': 'no_token'})

    conn = _db()
    try:
        uid = _user_id(conn, token)
        if not uid:
            return _resp(401, {'error': 'invalid_token'})

        cur = conn.cursor()

        if method == 'GET':
            cur.execute("SELECT data FROM user_children WHERE user_id = %s", (uid,))
            row = cur.fetchone()
            data = row[0] if row else {}
            if isinstance(data, str):
                data = json.loads(data)
            return _resp(200, {'data': data or {}})

        if method == 'POST':
            try:
                body = json.loads(event.get('body') or '{}')
            except Exception:
                return _resp(400, {'error': 'bad_json'})
            data = body.get('data')
            if not isinstance(data, dict):
                return _resp(400, {'error': 'invalid_data'})
            payload = json.dumps(data)
            cur.execute(
                "INSERT INTO user_children (user_id, data, updated_at) VALUES (%s, %s, NOW()) "
                "ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()",
                (uid, payload),
            )
            conn.commit()
            return _resp(200, {'ok': True})

        return _resp(405, {'error': 'method_not_allowed'})
    finally:
        conn.close()
