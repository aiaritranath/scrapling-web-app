# 🔎 Scrapling Web Scraper

A lightweight **web scraping application and JSON API** built with **Next.js**, **React**, **Python**, and **Scrapling**, designed to run on **Vercel**.

The application provides a simple web interface where you can enter a website URL and optionally provide a CSS selector to extract specific content.

It also exposes a serverless API at:

```text
POST /api/scrape
```

---

## ✨ Features

- 🌐 Scrape public HTTP/HTTPS websites
- 🎯 Extract content using CSS selectors
- 📄 Extract full-page text when no selector is supplied
- 🏷️ Return the target page title
- 🔢 Return the number of matched elements
- 🔄 Follow HTTP redirects
- 🛡️ Validate incoming URLs
- ⚡ Python serverless API powered by Scrapling
- ▲ Vercel-ready deployment
- 🧩 Next.js + React frontend
- 📦 JSON API responses
- 🌍 CORS headers enabled
- ❤️ Built-in API health check
- 🧹 JSON-safe serialization of Scrapling selector results
- 🚫 Helpful error responses for invalid requests and failed scraping

---

## 🖥️ Tech Stack

### Frontend

- [Next.js](https://nextjs.org/)
- React 19
- TypeScript
- CSS

### Backend

- Python 3.13
- [Scrapling](https://github.com/D4Vinci/Scrapling) 0.4.15
- Vercel Python Serverless Functions

### Deployment

- Vercel
- GitHub

---

## 📁 Project Structure

```text
scrapling-web-app/
│
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── api/
│   └── scrape.py
│
├── .gitignore
├── next-env.d.ts
├── package.json
├── pyproject.toml
├── requirements.txt
├── tsconfig.json
├── vercel.json
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/scrapling-web-app.git
cd scrapling-web-app
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## 2. Install Node.js dependencies

```bash
npm install
```

---

## 3. Install Python dependencies

This project requires:

```text
Python >= 3.13 and < 3.14
```

Install the Python dependencies with:

```bash
pip install -r requirements.txt
```

Or, if you are using the project configuration:

```bash
pip install .
```

The project uses:

```text
scrapling[fetchers]==0.4.15
```

### Important Python version note

The project is configured for Python 3.13:

```toml
requires-python = ">=3.13,<3.14"
```

Using a different Python version may cause dependency or deployment problems.

---

# 💻 Run Locally

Start the Next.js development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

You should see the **Scrapling Web Scraper** interface.

---

# 🔌 API Documentation

## Endpoint

```text
POST /api/scrape
```

### Local

```text
http://localhost:3000/api/scrape
```

### Production

```text
https://YOUR-DOMAIN.vercel.app/api/scrape
```

---

# 📤 Request

Send a JSON request containing a website URL.

### Basic request

```json
{
  "url": "https://example.com"
}
```

### Request with CSS selector

```json
{
  "url": "https://example.com",
  "selector": "h1"
}
```

You can use selectors such as:

```text
h1
h2
.title
.product-title
#main-content
article
nav a
div.product p.description
```

---

# 📥 API Responses

## 1. Selector extraction

Request:

```json
{
  "url": "https://example.com",
  "selector": "h1"
}
```

Example response:

```json
{
  "ok": true,
  "type": "selector",
  "url": "https://example.com",
  "selector": "h1",
  "status": 200,
  "count": 1,
  "results": [
    "Example Domain"
  ]
}
```

### Response fields

| Field | Description |
|---|---|
| `ok` | Whether the request succeeded |
| `type` | Result type |
| `url` | Target URL |
| `selector` | CSS selector used |
| `status` | Target website HTTP status |
| `count` | Number of matched elements |
| `results` | Extracted text values |

---

# 📄 2. Full-page extraction

If `selector` is empty or omitted, the API extracts the page text.

Request:

```json
{
  "url": "https://example.com"
}
```

Example response:

```json
{
  "ok": true,
  "type": "full_page",
  "url": "https://example.com",
  "title": "Example Domain",
  "status": 200,
  "text": "Example Domain...",
  "truncated": false
}
```

### Output limit

Full-page text is limited to:

```text
10,000 characters
```

If the content is longer than 10,000 characters:

```json
{
  "truncated": true
}
```

---

# ❤️ API Health Check

The API supports a `GET` request for checking whether the Python serverless function is deployed and reachable.

```text
GET /api/scrape
```

Example:

```bash
curl https://YOUR-DOMAIN.vercel.app/api/scrape
```

Example response:

```json
{
  "ok": true,
  "service": "Scrapling Web Scraper API",
  "status": "healthy",
  "endpoint": "/api/scrape",
  "method": "POST",
  "message": "Python function is deployed and reachable."
}
```

This is useful for troubleshooting Vercel deployments.

---

# 🧪 Testing the API with cURL

## GET health check

```bash
curl https://YOUR-DOMAIN.vercel.app/api/scrape
```

## Scrape a page

```bash
curl -X POST https://YOUR-DOMAIN.vercel.app/api/scrape \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"https://example.com\"}"
```

## Extract a specific element

```bash
curl -X POST https://YOUR-DOMAIN.vercel.app/api/scrape \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"https://example.com\",\"selector\":\"h1\"}"
```

---

# 🐍 Using the API with Python

```python
import requests

API_URL = "https://YOUR-DOMAIN.vercel.app/api/scrape"

payload = {
    "url": "https://example.com",
    "selector": "h1"
}

response = requests.post(API_URL, json=payload)

print(response.json())
```

---

# 🟨 Using the API with JavaScript

```javascript
const response = await fetch(
  "https://YOUR-DOMAIN.vercel.app/api/scrape",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      url: "https://example.com",
      selector: "h1"
    })
  }
);

const data = await response.json();

console.log(data);
```

---

# ⚠️ Error Responses

## Missing URL

Request:

```json
{
  "selector": "h1"
}
```

Response:

```json
{
  "ok": false,
  "error": "URL is required."
}
```

---

## Invalid URL

Only `http://` and `https://` URLs are accepted.

Example invalid request:

```json
{
  "url": "example.com"
}
```

Response:

```json
{
  "ok": false,
  "error": "Only valid http:// and https:// URLs are supported."
}
```

---

## Invalid JSON

If the request body is not valid JSON:

```json
{
  "ok": false,
  "error": "Invalid JSON request body."
}
```

---

## Target website error

If the target website returns an HTTP error such as `404` or `500`, the API returns an error response.

Example:

```json
{
  "ok": false,
  "error": "Target website returned HTTP 404.",
  "target_status": 404,
  "url": "https://example.com/not-found"
}
```

---

## Scraping failure

Unexpected scraping errors are returned as:

```json
{
  "ok": false,
  "error": "Scraping failed.",
  "details": "..."
}
```

---

# ▲ Deploy to Vercel

## Method 1 — GitHub + Vercel

### 1. Push the project to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/scrapling-web-app.git
git push -u origin main
```

### 2. Open Vercel

Go to:

```text
https://vercel.com/
```

Create a new project and import the GitHub repository.

### 3. Deploy

Vercel should detect:

```text
Next.js
```

and the Python serverless function:

```text
api/scrape.py
```

Deploy the project.

---

# ⚙️ Vercel Configuration

The project contains:

```text
vercel.json
```

Currently it contains the basic Vercel configuration:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json"
}
```

The API is located at:

```text
/api/scrape
```

No custom rewrite is required for the current project structure.

---

# 🔐 Environment Variables

The current project does **not require any API keys or environment variables**.

You can therefore deploy it directly without creating a `.env` file.

If you later add authentication, rate limiting, third-party APIs, proxies, or database functionality, store secrets in Vercel Environment Variables instead of committing them to GitHub.

---

# 🧠 How It Works

The application consists of two main parts.

```text
┌──────────────────────────────┐
│       Next.js Frontend       │
│                              │
│ URL + CSS Selector           │
└──────────────┬───────────────┘
               │
               │ POST /api/scrape
               ▼
┌──────────────────────────────┐
│    Python Serverless API     │
│                              │
│        api/scrape.py         │
└──────────────┬───────────────┘
               │
               │ Scrapling Fetcher
               ▼
┌──────────────────────────────┐
│        Target Website        │
└──────────────┬───────────────┘
               │
               │ HTML
               ▼
┌──────────────────────────────┐
│      Scrapling Parser        │
│                              │
│   CSS selector / full text   │
└──────────────┬───────────────┘
               │
               │ JSON
               ▼
┌──────────────────────────────┐
│        Next.js Frontend      │
│        Displays Results      │
└──────────────────────────────┘
```

---

# 🧹 JSON Serialization Fix

Scrapling 0.4+ can expose selected text through wrapper objects such as `Selector` and `TextHandler`.

Returning these objects directly through `json.dumps()` can produce an error similar to:

```text
TypeError: Object of type Selector is not JSON serializable
```

This project explicitly converts extracted values to normal Python strings before returning JSON.

For example:

```python
results = [
    str(element.get_all_text(strip=True))
    for element in elements
]
```

and:

```python
text = str(page.get_all_text(strip=True))
```

This keeps the API response JSON serializable.

---

# 🌐 CORS

The API currently sends:

```text
Access-Control-Allow-Origin: *
```

and supports:

```text
GET
POST
OPTIONS
```

with:

```text
Content-Type
```

headers.

This allows the API to be called from external frontend applications.

---

# 📊 Supported Scraping Modes

| Mode | Selector | Result |
|---|---|---|
| Full page | Not provided | Page title + text |
| CSS extraction | Provided | Matching element text |
| Health check | GET request | API status |

---

# 🛠️ Available npm Scripts

### Development

```bash
npm run dev
```

Starts the Next.js development server.

### Production build

```bash
npm run build
```

Creates a production build.

### Production server

```bash
npm run start
```

Starts the production Next.js server.

### Lint

```bash
npm run lint
```

Runs the configured lint command.

---

# 🔒 Responsible Use

This project is intended for legitimate web scraping and data extraction.

Before scraping a website:

- Check the website's Terms of Service.
- Respect `robots.txt` and applicable policies.
- Avoid excessive request rates.
- Do not bypass authentication or access controls.
- Do not collect sensitive personal information without authorization.
- Make sure your use complies with applicable laws and regulations.

The API does not guarantee that every website can be scraped successfully.

Some websites may use:

- JavaScript rendering
- Bot protection
- CAPTCHA
- Authentication
- IP restrictions
- Rate limiting
- Geo restrictions

Such websites may require additional scraping infrastructure or authorization.

---

# 🚧 Current Limitations

The current version is intentionally simple.

It does not currently include:

- Authentication
- API keys
- Per-user rate limiting
- Proxy rotation
- Browser automation
- CAPTCHA solving
- JavaScript browser rendering
- Database storage
- Scraping job queues
- Scheduled scraping
- Export to CSV/JSON files
- Crawl multiple pages
- Sitemap crawling

These can be added in future versions.

---

# 🔮 Possible Future Improvements

Potential upgrades include:

- 🔑 API key authentication
- 🚦 Rate limiting
- 🕷️ Multi-page crawling
- 🗺️ Sitemap scraping
- 📦 JSON/CSV export
- 🧾 HTML extraction
- 🖼️ Image extraction
- 🔗 Link extraction
- 📊 Structured data extraction
- 🤖 Browser-based JavaScript rendering
- 🗃️ Database storage
- 📅 Scheduled scraping
- 🔔 Webhooks
- 📈 Scraping analytics
- 👤 User accounts
- 💳 Usage-based API plans
- ⚡ Background scraping jobs

---

# 📝 Example Workflow

### Step 1

Open the web application.

### Step 2

Enter:

```text
https://example.com
```

### Step 3

Optionally enter:

```text
h1
```

### Step 4

Click:

```text
Scrape Website
```

### Step 5

The frontend sends:

```http
POST /api/scrape
Content-Type: application/json
```

with:

```json
{
  "url": "https://example.com",
  "selector": "h1"
}
```

### Step 6

The Python API fetches the website using Scrapling.

### Step 7

The API returns structured JSON.

### Step 8

The Next.js frontend displays the extracted content.

---

# 🧑‍💻 Development

Contributions and improvements are welcome.

A typical development workflow:

```bash
git clone <repository-url>
cd scrapling-web-app

npm install

pip install -r requirements.txt

npm run dev
```

Make your changes, test locally, then:

```bash
git add .
git commit -m "Update scraper"
git push
```

If the repository is connected to Vercel, the new commit can trigger a deployment automatically.

---

# 📜 License

No license file is currently included in this repository.

If you plan to distribute this project publicly, add an appropriate license such as MIT.

---

# 👤 Author

**Aritra Nath Hazra**

AI Specialist  
Generative AI Engineer • AI Automation Engineer • AI & Full-Stack Developer

### Technologies

```text
Python
Next.js
React
TypeScript
FastAPI
Flask
Node.js
Scrapling
n8n
Make
Generative AI
```

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📌 Quick Reference

### Frontend

```text
/
```

### API

```text
POST /api/scrape
```

### Health check

```text
GET /api/scrape
```

### Request

```json
{
  "url": "https://example.com",
  "selector": "h1"
}
```

### Python version

```text
3.13.x
```

### Scrapling version

```text
0.4.15
```

### Framework

```text
Next.js 15
```

### Deployment

```text
Vercel
```

---

**Built with Next.js + Python + Scrapling + Vercel.**
