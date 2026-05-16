"""
EventBridge-triggered Lambda that calls the QBO sync cron endpoint.

Replaces Vercel Cron: "*/5 * * * *" -> GET /api/cron/qbo-sync
The endpoint is protected by Bearer token auth (CRON_SECRET).

Environment variables (set in Lambda configuration):
  CRON_ENDPOINT_URL  - https://sanantonioaiagents.com/api/cron/qbo-sync
  CRON_SECRET        - Must match the CRON_SECRET in the Amplify app
"""

import json
import os
import urllib.request
import urllib.error


def handler(event, context):
    url = os.environ["CRON_ENDPOINT_URL"]
    secret = os.environ["CRON_SECRET"]

    req = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Bearer {secret}",
            "User-Agent": "AWS-EventBridge-Cron/1.0",
        },
        method="GET",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = resp.read().decode()
            print(f"Cron response {resp.status}: {body}")
            return {"statusCode": resp.status, "body": body}
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"Cron failed: {e.code} {error_body}")
        raise RuntimeError(f"Cron endpoint returned {e.code}: {error_body}")
    except Exception as e:
        print(f"Cron error: {e}")
        raise
