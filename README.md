# Scrapling Web Scraper

Next.js frontend + Scrapling Python serverless function for Vercel.

## Project structure

```text
app/
  layout.tsx
  page.tsx
  globals.css
api/
  scrape.py
requirements.txt
vercel.json
package.json
tsconfig.json
next-env.d.ts
```

## Local development

```bash
npm install
npm run dev
```

The frontend uses:

```text
POST /api/scrape
```

Request:

```json
{
  "url": "https://example.com",
  "selector": "h1"
}
```

The API also supports `GET /api/scrape` as a health check.

## Vercel deployment

Push this repository to GitHub and import it into Vercel.

Vercel automatically detects:

```text
api/scrape.py
```

as a Python serverless function.

No rewrite is required.

After deployment, test:

```text
https://YOUR-DOMAIN.vercel.app/api/scrape
```

A successful health check returns JSON instead of an HTML 404 page.


## JSON serialization

Scrapling 0.4+ wraps selected text nodes in `Selector` objects. The API explicitly
converts extracted values to plain strings before returning JSON.
