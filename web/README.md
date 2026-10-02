# Web explorer

A static site for the ARIMA workshop. It has a Home page with the session plan, a Lecture page of seven beats, a Hands-on page for the three notebook blocks, three interactive demos, and a glossary. It uses Vite, TypeScript, Plotly, and the Barlow fonts (all bundled, no CDN). It has no backend, no login, and no analytics. It is light mode only.

All commands run in the `web/` folder. You need Node.js 20 or later.

## Pages

| Route | Page |
| --- | --- |
| `#/` | The session plan: two lines, twelve stops |
| `#/lecture/1` to `#/lecture/7` | One lecture beat each. Use the left and right arrow keys. |
| `#/hands-on` | Setup and blocks A, B, and C, with Colab links and check questions. `#/hands-on/b` jumps to block B. |
| `#/demos` | The three demos |
| `#/glossary` | The glossary. `#/glossary/adf-test` jumps to a term. |

The session clock in the header counts up from the start of the hour and marks the current stop. It keeps its time in local storage, so a reload does not reset it.

The plan, the beats, and the blocks are in `src/content.ts`. The colors and type are tokens at the top of `src/style.css`. `DESIGN.md` at the repository root records the design system.

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

## Glossary

The terms are in `src/glossary.json`. The Glossary page reads that file. To rebuild `../docs/glossary.md` after you edit it, run:

```
npm run export-glossary
```

`npm test` fails if `docs/glossary.md` is out of date.

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
