# Anshul Raj Portfolio

A small static portfolio site built with plain HTML, CSS, and JavaScript, deployed
on Cloudflare Pages at https://anshulraj.lucidlab.app/

## Design

The visual style is "warm paper": a printed-datasheet look with a cream ground,
black ink, hairline rules, and monospace uppercase captions. Everything is square
(`--radius: 0`), there are no box shadows, and the single orange accent is used as
punctuation only, never as a fill.

## Files

- `index.html` page content and metadata.
- `styles.css` design tokens, the three type roles, layout, and responsive rules.
- `script.js` theme toggle, mobile navigation, project filters, row reveal, active nav.
- `_headers` security and caching headers, read automatically by Cloudflare Pages.

## Run locally

Open `index.html` in a browser, or serve the folder with any static server.

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
