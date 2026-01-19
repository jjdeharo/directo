# Repository Guidelines

## Project Structure & Module Organization
- Root HTML files are the entry points for each app: `index.html`, `vota.html`, `nube.html`, `ideas.html`, `muro.html`, `escala.html`, and `manual.html`.
- Localization lives in `locales/`. Each app has its own folder (e.g., `locales/escala/`, `locales/index/`) with per-language JSON files like `es.json` or `en.json`.
- `locales/index.json` lists available languages. The locale editor assets are in `locales/editor.html`, `locales/editor.js`, and `locales/editor.css`.
- Static assets are embedded or referenced directly from the HTML files; there is no separate build output folder.

## Build, Test, and Development Commands
- No build step is required. Open `index.html` directly in a browser.
- For local serving (recommended if the browser blocks file URLs), run:
  - `python3 -m http.server` and open `http://localhost:8000/`.

## Coding Style & Naming Conventions
- Keep the codebase in vanilla HTML/CSS/JS. Avoid adding a framework unless there is a clear need.
- Follow existing formatting and keep indentation consistent within each file (match current spacing).
- Locale files use lowercase language codes (`es`, `en`, `ca`, `eu`, `gl`, `de`) and per-app JSON files named accordingly.

## Testing Guidelines
- There are no automated tests at the moment. Validate changes manually by opening the relevant HTML page and verifying:
  - Presenter flow, participant flow, and QR/link generation.
  - Localization strings render correctly in the UI.

## Commit & Pull Request Guidelines
- Commits are short, imperative, and often in Spanish or English (e.g., “Update escala.html”, “Mejora QR en proyección”). Keep messages concise and action-oriented.
- PRs should describe the user-facing change, list affected pages, and mention any updated locale files. Include screenshots or short GIFs for UI changes when practical.

## Localization Notes
- When adding strings, update the matching `locales/<app>/<lang>.json` files and ensure keys stay consistent across languages.
- If you add a new language, update `locales/index.json` and provide translations for each app that exposes UI text.
