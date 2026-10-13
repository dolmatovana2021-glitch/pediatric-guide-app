import html
import json
import os
import urllib.parse
import urllib.request

import psycopg2

CATEGORIES = {'idea', 'bug', 'content', 'other'}
CATEGORY_LABELS = {'idea': '💡 Идея', 'bug': '🐞 Ошибка', 'content': '📚 Материалы', 'other': '💬 Другое'}


def _notify_telegram(fid: int, category: str, message: str, contact) -> bool:
    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    if not token or not chat_id:
        return False
    text = (
        f"<b>Новое пожелание №{fid}</b>\n"
        f"Тема: {CATEGORY_LABELS.get(category, category)}\n\n"
        f"{html.escape(message[:3500])}\n\n"
        f"Контакт: {html.escape(contact) if contact else 'не указан'}"
    )
    data = urllib.parse.urlencode({
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'HTML',
        'disable_web_page_preview': 'true',
    }).encode()
    try:
        req = urllib.request.Request(f'https://api.telegram.org/bot{token}/sendMessage', data=data)
        with urllib.request.urlopen(req, timeout=3) as r:
            return r.status == 200
    except Exception as e:
        print(f'telegram notify failed: {type(e).__name__}')
        return False


def _cors() -> dict:
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }


def _resp(status: int, body: dict) -> dict:
    return {
        'statusCode': status,
        'headers': {**_cors(), 'Content-Type': 'application/json'},
        'isBase64Encoded': False,
        'body': json.dumps(body),
    }


def handler(event: dict, context) -> dict:
    '''Приём пожеланий и сообщений об ошибках от пользователей приложения.'''
    method = event.get('httpMethod', 'POST')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors(), 'isBase64Encoded': False, 'body': ''}
    if method != 'POST':
        return _resp(405, {'error': 'method_not_allowed'})

    try:
        body = json.loads(event.get('body') or '{}')
    except Exception:
        return _resp(400, {'error': 'bad_json'})

    message = str(body.get('message') or '').strip()
    if len(message) < 3:
        return _resp(400, {'error': 'empty_message'})
    message = message[:4000]
    category = body.get('category') if body.get('category') in CATEGORIES else 'idea'
    contact = str(body.get('contact') or '').strip()[:200] or None
    version = str(body.get('version') or '')[:40] or None
    headers = event.get('headers') or {}
    ua = (headers.get('User-Agent') or headers.get('user-agent') or '')[:300] or None
    ip = ((event.get('requestContext') or {}).get('identity') or {}).get('sourceIp') or ''
    ip = ip[:64]

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT COUNT(*) FROM feedback WHERE ip = %s AND created_at > NOW() - INTERVAL '1 hour'",
            (ip,),
        )
        if cur.fetchone()[0] >= 10:
            return _resp(429, {'error': 'too_many'})
        cur.execute(
            "INSERT INTO feedback (category, message, contact, app_version, user_agent, ip) "
            "VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
            (category, message, contact, version, ua, ip),
        )
        new_id = cur.fetchone()[0]
        conn.commit()
    finally:
        conn.close()
    _notify_telegram(new_id, category, message, contact)
    return _resp(200, {'ok': True, 'id': new_id})
