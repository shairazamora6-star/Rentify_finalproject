# Rentify

Rentify is a mobile-first rental marketplace built with JavaScript, React, and Vite.

## Project layout

- `frontend/` contains the React/Vite application, static assets, and its package manifest.
- `backend/` contains the Express API, SQL Server integration, backend package manifest, and environment-variable example.
- The root package manifest manages both workspaces and provides frontend-only and full-stack development commands.

## Run locally

```bash
npm install
npm run dev
```

The frontend runs on port `5173` (`http://localhost:5173`). The default `npm run dev` starts only Vite and uses browser-local demo data, so SQL Server and the API are not required. To change the frontend port, update `server.port` and `preview.port` in `frontend/vite.config.js`. The Vite dev and preview servers bind to all network interfaces so other devices on your private network can use `http://<computer-LAN-IP>:5173`.

For frontend-only walkthroughs, sign-in accepts any valid email and non-empty password. Registrations, favorites, and reservations are simulated and stored only in this browser; they are not sent to the database. To use the API instead, set `VITE_DEMO_MODE=false` in `frontend/.env.local`, then start the backend with `npm run server`. `npm run dev:full` starts both workspaces and waits for the API before opening Vite.

The API port defaults to `5175` and can be changed with `PORT` in `.env.local`. If you change it, also update the API proxy in `frontend/vite.config.js` and the health-check URL in `frontend/scripts/wait-for-api.js`. Root commands `npm run build` and `npm run lint` (ESLint) target the frontend.

Vite keeps port 5173 strict and will exit with an error if another process already owns it rather than silently switching ports. Access from another device requires both devices to be on the same network and Windows Firewall to allow inbound TCP 5173. This is development-server access for a trusted private network, not public internet hosting.

## Database

The full-stack backend uses SQL Server with Windows Authentication. Configure its `SQL_SERVER` and `SQL_DATABASE` values in `.env.local`. When the API starts, it creates any missing tables and seeds the catalog if the items table is empty.

## Nearby rentals

The Nearby page asks for browser location only after the user selects **Use my location**. Coordinates are used for that request only and are not stored. Distances are approximate: the current sample listings contain city names, not item coordinates, so results use listing-city centers and do not reveal owners' locations. Manual search currently supports the catalog cities (San Francisco, Los Angeles, Austin, Seattle, Portland, Brooklyn, Chicago, and Denver) and their common ZIP prefixes. A production location provider can replace this sample-area resolver when its API is available.

## Password recovery

Use `backend/.env.example` as a reference for local settings. The API loads `.env.local` from `backend/` first, then the repository root, followed by `.env` in the same order. Keep provider keys server-side (do not prefix them with `VITE_`). Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` to enable password reset emails. Set `APP_BASE_URL` to the public frontend origin when deployed. Reset links expire after 30 minutes and are single-use; only a hash of each reset token is stored. Without SMTP settings, password recovery returns an explicit configuration error. Keep `.env.local` private and never commit provider credentials.

## Rental helper

The floating Rental helper searches the current SQL catalog when no chatbot API is configured. To use OpenRouter, set `CHATBOT_API_URL=https://openrouter.ai/api/v1/chat/completions`, `CHATBOT_API_KEY`, and `CHATBOT_MODEL` in `.env.local`. Rentify sends an OpenAI-compatible chat-completions request with the current SQL listings and expects a JSON reply containing `reply` and `itemIds`; returned IDs are matched against actual listings before being shown. `openrouter/free` selects an available free model.

For manual city/ZIP geocoding, set `LOCATION_API_URL` and `LOCATION_API_KEY`. Rentify sends `GET <URL>?q=<city-or-ZIP>` with the same Bearer authorization and expects `{ "latitude": 0, "longitude": 0, "label": "..." }`. Device coordinates are not sent to this third-party endpoint. Current SQL listings contain city names rather than precise coordinates, so even with geocoding, distances to listings remain approximate until listing coordinates are supplied.

Public internet access is possible by deploying behind a secured public host or using an authenticated tunnel. Do not expose the Vite development server directly to the public internet.
