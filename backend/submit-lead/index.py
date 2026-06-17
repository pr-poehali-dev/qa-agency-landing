import json
import os
import urllib.request
import urllib.parse


def handler(event: dict, context) -> dict:
    """Принимает заявку с сайта и отправляет её куратору в Telegram."""

    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    age = body.get("age", "").strip()
    city = body.get("city", "").strip()
    telegram = body.get("telegram", "").strip().lstrip("@")

    if not all([name, age, city, telegram]):
        return {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Все поля обязательны"}),
        }

    token = os.environ["TELEGRAM_BOT_TOKEN"]
    chat_id = os.environ["TELEGRAM_CHAT_ID"]

    text = (
        "🔔 *Новая заявка с сайта QA-Agency*\n\n"
        f"👤 *Имя:* {name}\n"
        f"🎂 *Возраст:* {age}\n"
        f"🏙 *Город:* {city}\n"
        f"✈️ *Telegram:* @{telegram}\n\n"
        f"[Написать кандидату](https://t.me/{telegram})"
    )

    payload = json.dumps({
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "Markdown",
    }).encode("utf-8")

    req = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        tg_result = json.loads(resp.read())

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"ok": True, "tg": tg_result.get("ok")}),
    }
