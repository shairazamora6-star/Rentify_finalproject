# Rentify

Rentify is a mobile-first rental marketplace built with React and Vite.

## Run locally

```bash
npm install
npm run dev
```

The app runs on port `5173` (`http://localhost:5173`). The Vite dev and preview servers bind to all network interfaces so other devices on your private network can use `http://<computer-LAN-IP>:5173`. The API runs on `http://127.0.0.1:5175` and stays bound to loopback; the frontend proxies API requests to it.

Vite keeps port 5173 strict and will exit with an error if another process already owns it rather than silently switching ports. Access from another device requires both devices to be on the same network and Windows Firewall to allow inbound TCP 5173. This is development-server access for a trusted private network, not public internet hosting.

## Database

SQL Server 2019 uses Windows Authentication. The default connection is `YURICHIEE\SQL_VER2` / `RentifyDB`. The API creates the required tables and seeds the catalog on first startup.

## Nearby rentals

The Nearby page asks for browser location only after the user selects **Use my location**. Coordinates are used for that request only and are not stored. Distances are approximate: the current sample listings contain city names, not item coordinates, so results use listing-city centers and do not reveal owners' locations. Manual search currently supports the catalog cities (San Francisco, Los Angeles, Austin, Seattle, Portland, Brooklyn, Chicago, and Denver) and their common ZIP prefixes. A production location provider can replace this sample-area resolver when its API is available.

## Password recovery

Copy `.env.example` to `.env.local` for local settings. The API loads `.env.local` before `.env`; keep provider keys server-side (do not prefix them with `VITE_`). Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` to enable password reset emails. Set `APP_BASE_URL` to the public frontend origin when deployed. Reset links expire after 30 minutes and are single-use; only a hash of each reset token is stored. Without SMTP settings, password recovery returns an explicit configuration error. Keep `.env.local` private and never commit provider credentials.

## Rental helper

The floating Rental helper searches the current SQL catalog when no chatbot API is configured. To connect a custom chatbot, set `CHATBOT_API_URL` and `CHATBOT_API_KEY` in `.env.local`. Rentify sends `POST` JSON `{ "message": "...", "listings": [...] }` with `Authorization: Bearer <key>`. The response contract is `{ "reply": "...", "itemIds": [1, 2] }`; returned IDs are matched against actual SQL listings before being shown.

For manual city/ZIP geocoding, set `LOCATION_API_URL` and `LOCATION_API_KEY`. Rentify sends `GET <URL>?q=<city-or-ZIP>` with the same Bearer authorization and expects `{ "latitude": 0, "longitude": 0, "label": "..." }`. Device coordinates are not sent to this third-party endpoint. Current SQL listings contain city names rather than precise coordinates, so even with geocoding, distances to listings remain approximate until listing coordinates are supplied.

Public internet access is possible by deploying behind a secured public host or using an authenticated tunnel. Do not expose the Vite development server directly to the public internet.
