# Anshul Raj Portfolio

A small static portfolio site built with plain HTML, CSS, and JavaScript, deployed
on Cloudflare Pages at https://anshulraj.lucidlab.app/

## Design

The visual style is editorial-tech: asymmetric typography, restrained warm neutrals,
a dark-first palette, and a single red-orange accent. An interactive project index
keeps the work easy to scan while providing a distinctive visual anchor.

## Files

- `index.html` page content and metadata.
- `styles.css` design tokens, the three type roles, layout, and responsive rules.
- `script.js` theme toggle, mobile navigation, project filters, row reveal, active nav.
- `_headers` security and caching headers, read automatically by Cloudflare Pages.

## Run locally

Open `index.html` in a browser, or serve the folder with any static server.

```bash
uv run python -m http.server 8000
```

Then visit `http://localhost:8000`.
