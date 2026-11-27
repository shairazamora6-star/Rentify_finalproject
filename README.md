# Rentify

Rentify is a mobile-first rental marketplace built with JavaScript, React, and Vite.

## Project layout

- `frontend/` contains the React/Vite application, static assets, and its package manifest.
- The root package manifest manages the frontend workspace and provides frontend development commands.

## Run locally

```bash
npm install
npm run dev
```

The frontend runs on port `5173` (`http://localhost:5173`). The default `npm run dev` starts Vite and uses browser-local demo data. To change the frontend port, update `server.port` and `preview.port` in `frontend/vite.config.js`. The Vite dev and preview servers bind to all network interfaces so other devices on your private network can use `http://<computer-LAN-IP>:5173`.

For frontend walkthroughs, sign-in accepts any valid email and non-empty password. Registrations, favorites, and reservations are simulated and stored only in this browser. Root commands `npm run build` and `npm run lint` (ESLint) target the frontend.

Vite may automatically select another available port if 5173 is already occupied. Access from another device requires both devices to be on the same network and Windows Firewall to allow inbound TCP 5173. This is development-server access for a trusted private network, not public internet hosting.

## Nearby rentals

The Nearby page asks for browser location only after the user selects **Use my location**. Coordinates are used for that request only and are not stored. Distances are approximate: the current sample listings contain city names, not item coordinates, so results use listing-city centers and do not reveal owners' locations. Manual search currently supports the catalog cities (San Francisco, Los Angeles, Austin, Seattle, Portland, Brooklyn, Chicago, and Denver) and their common ZIP prefixes. A production location provider can replace this sample-area resolver when its API is available.

## Password recovery

The frontend-only password recovery flow is simulated in the browser. It does not send email or change a real account password.

## Rental helper

The floating Rental helper searches the in-browser sample catalog.


Public internet access is possible by deploying behind a secured public host or using an authenticated tunnel. Do not expose the Vite development server directly to the public internet.
