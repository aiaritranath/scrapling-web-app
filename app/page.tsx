"use client";

import { useState } from "react";

type ScrapeResult =
  | {
      ok: boolean;
      type: "selector";
      url: string;
      selector: string;
      count: number;
      results: string[];
    }
  | {
      ok: boolean;
      type: "full_page";
      url: string;
      title: string;
      text: string;
      truncated: boolean;
    };

export default function Home() {
  const [url, setUrl] = useState("");
  const [selector, setSelector] = useState("");
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
          selector: selector.trim(),
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      const raw = await response.text();

      if (!contentType.toLowerCase().includes("application/json")) {
        console.error("Non-JSON API response:", raw.slice(0, 1000));
        throw new Error(
          `API returned HTTP ${response.status} instead of JSON. Check the Vercel deployment and /api/scrape function.`
        );
      }

      let data: any;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("The API returned invalid JSON.");
      }

      if (!response.ok) {
        throw new Error(data?.details ? `${data?.error || "Request failed."} ${data.details}` : (data?.error || `Request failed with HTTP ${response.status}.`));
      }

      if (!data?.ok) {
        throw new Error(data?.details ? `${data?.error || "Scraping failed."} ${data.details}` : (data?.error || "Scraping failed."));
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="card">
        <div className="badge">SCRAPLING API</div>
        <h1>Web Scraper</h1>
        <p className="subtitle">
          Enter a website URL and optionally provide a CSS selector to extract
          specific content.
        </p>

        <label htmlFor="url">Website URL</label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          autoComplete="url"
        />

        <label htmlFor="selector">CSS Selector <span>(optional)</span></label>
        <input
          id="selector"
          type="text"
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          placeholder="h1, .product-title, #main-content"
        />

        <button
          onClick={handleScrape}
          disabled={loading || !url.trim()}
        >
          {loading ? "Scraping…" : "Scrape Website"}
        </button>

        {error && (
          <div className="error" role="alert">
            <strong>Error</strong>
            <div>{error}</div>
          </div>
        )}

        {result && (
          <section className="results">
            <h2>Results</h2>

            {result.type === "selector" ? (
              <>
                <div className="meta">
                  <span>Selector: <code>{result.selector}</code></span>
                  <span>Matches: {result.count}</span>
                </div>

                {result.results.length === 0 ? (
                  <p className="muted">No elements matched this selector.</p>
                ) : (
                  <ul>
                    {result.results.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <>
                <p><strong>Title:</strong> {result.title || "Untitled page"}</p>
                <pre>{result.text}</pre>
                {result.truncated && (
                  <p className="muted">
                    Output was truncated to 10,000 characters.
                  </p>
                )}
              </>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
