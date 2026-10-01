# Web explorer

A static site with a lecture summary and three interactive demos for the ARIMA workshop. It uses Vite, TypeScript, and Plotly (bundled, no CDN). It has no backend, no login, and no analytics.

All commands run in the `web/` folder. You need Node.js 20 or later.

## Install

```
npm ci
```

## Test

```
npm test
```

The tests cover the ADF helper, the Durbin-Levinson PACF, the CSS fit, forecasts, and series validation.

## Build

```
npm run build
```

The build runs `scripts/export-series.mjs` first. That script reads `../data/energy_demand_daily.csv`, resamples it to weekly means (weeks start on Monday, incomplete weeks are dropped), and writes `public/data/weekly_demand.json`. The output goes to `dist/`.

To regenerate only the weekly series:

```
npm run export-series
```

## Preview the built site

```
npx vite preview
```

Open the address that the command prints, for example `http://localhost:4173/`.

## Build for GitHub Pages

```
WEB_BASE_PATH=/arima-workshop-ccis/ npm run build
```

`WEB_BASE_PATH` sets the Vite `base`. The default is `/`. The workflow `.github/workflows/pages.yml` sets it for you.

## Data file format

`public/data/weekly_demand.json` has the fields `schema_version` (1), `source`, `freq`, `dates`, and `values`. The page shows a plain message and turns off the ARIMA demo if `schema_version` is not 1. The other demos keep working.

## Notes

The ARIMA playground fits by conditional sum of squares. The ADF statistic is a teaching approximation. Neither one replaces `statsmodels`.
