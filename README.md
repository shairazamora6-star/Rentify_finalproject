# Rentify

Rentify is a mobile-first rental marketplace built with React and Vite.

## Run locally

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173`. The API runs on `http://127.0.0.1:5175`.

## Database

SQL Server 2019 uses Windows Authentication. The default connection is `YURICHIEE\SQL_VER2` / `RentifyDB`. The API creates the required tables and seeds the catalog on first startup.

## Nearby rentals

The Nearby page asks for browser location only after the user selects **Use my location**. Coordinates are used for that request only and are not stored. Distances are approximate: the current sample listings contain city names, not item coordinates, so results use listing-city centers and do not reveal owners' locations. Manual search currently supports the catalog cities (San Francisco, Los Angeles, Austin, Seattle, Portland, Brooklyn, Chicago, and Denver) and their common ZIP prefixes. A production location provider can replace this sample-area resolver when its API is available.

## Password recovery

Copy `.env.example` to `.env` and configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM`. Set `APP_BASE_URL` to the public frontend origin when deployed. Reset links expire after 30 minutes and are single-use; only a hash of each reset token is stored. Without SMTP settings, password recovery returns an explicit configuration error. Keep `.env` private and never commit provider credentials.

## Rental helper

The floating Rental helper searches the current SQL catalog and suggests matching listings. It is a local catalog-based helper, not an AI chatbot; the recommendation endpoint can be replaced when a chatbot API is available.
