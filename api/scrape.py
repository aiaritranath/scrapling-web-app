from http.server import BaseHTTPRequestHandler
import json
from urllib.parse import urlparse


class handler(BaseHTTPRequestHandler):

    def _send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self._send_json(200, {"ok": True})

    def do_GET(self):
        self._send_json(200, {
            "ok": True,
            "service": "Scrapling Web Scraper API",
            "status": "healthy",
            "endpoint": "/api/scrape",
            "method": "POST",
            "message": "Python function is deployed and reachable."
        })

    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(content_length)

            try:
                data = json.loads(raw_body.decode("utf-8") or "{}")
            except Exception:
                self._send_json(400, {
                    "ok": False,
                    "error": "Invalid JSON request body."
                })
                return

            url = str(data.get("url", "")).strip()
            selector = str(data.get("selector", "")).strip()

            if not url:
                self._send_json(400, {
                    "ok": False,
                    "error": "URL is required."
                })
                return

            parsed = urlparse(url)
            if parsed.scheme not in ("http", "https") or not parsed.netloc:
                self._send_json(400, {
                    "ok": False,
                    "error": "Only valid http:// and https:// URLs are supported."
                })
                return

            try:
                from scrapling.fetchers import Fetcher
            except Exception as exc:
                self._send_json(500, {
                    "ok": False,
                    "error": "Scrapling could not be imported.",
                    "details": repr(exc)
                })
                return

            page = Fetcher.get(
                url,
                stealthy_headers=True,
                follow_redirects=True,
                timeout=30,
                retries=2
            )

            # Normalize response status in case the underlying response
            # implementation exposes a non-primitive value.
            raw_status = getattr(page, "status", None)
            try:
                status = int(raw_status) if raw_status is not None else None
            except (TypeError, ValueError):
                status = None

            if status is not None and status >= 400:
                self._send_json(502, {
                    "ok": False,
                    "error": f"Target website returned HTTP {status}.",
                    "target_status": status,
                    "url": url
                })
                return

            if selector:
                elements = page.css(selector)

                # Scrapling v0.4+ wraps selected text nodes in Selector
                # objects. get_all_text() returns TextHandler, not a plain
                # JSON primitive. Explicit str() makes the API JSON-safe.
                results = [
                    str(element.get_all_text(strip=True))
                    for element in elements
                ]

                self._send_json(200, {
                    "ok": True,
                    "type": "selector",
                    "url": url,
                    "selector": selector,
                    "status": status,
                    "count": len(results),
                    "results": results
                })
                return

            text = str(page.get_all_text(strip=True))

            # IMPORTANT:
            # page.css("title::text")[0] is a Selector in Scrapling 0.4+.
            # Do not put that Selector object into JSON.
            title_nodes = page.css("title::text")
            title = str(title_nodes.get("")) if title_nodes else ""

            self._send_json(200, {
                "ok": True,
                "type": "full_page",
                "url": url,
                "title": title,
                "status": status,
                "text": text[:10000],
                "truncated": len(text) > 10000
            })

        except Exception as exc:
            self._send_json(500, {
                "ok": False,
                "error": "Scraping failed.",
                "details": repr(exc)
            })
