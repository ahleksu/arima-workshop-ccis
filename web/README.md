# Web explorer

A static site for the ARIMA workshop. It has a Home page with the session plan as a moving line map, a Lecture page of four chapters, a Hands-on page for the three steps of notebook `03`, three interactive demos, and a glossary. The layout uses the full screen width and works on phones, tablets, and projectors. It uses Vite, TypeScript, Plotly, and the Barlow fonts (all bundled, no CDN). It has no backend, no login, and no analytics. It is light mode only.

All commands run in the `web/` folder. You need Node.js 20 or later.

## Pages

| Route | Page |
| --- | --- |
| `#/` | The session plan: two lines, nine stops. A marker travels along the stops. |
| `#/lecture/1` to `#/lecture/4` | One lecture chapter each. The left and right arrow keys move between chapters. |
| `#/hands-on` | Setup, three steps, and the recap, with Colab links and check questions. `#/hands-on/fit` jumps to step 2. The other ids are `setup`, `prepare`, `forecast`, and `recap`. |
| `#/demos` | The three demos |
| `#/glossary` | The glossary. `#/glossary/adf-test` jumps to a term. |

The session clock in the header counts up from the start of the hour and marks the current stop. It keeps its time in local storage, so a reload does not reset it. While the clock runs, the Home map marker rests at the current stop. When the clock is idle, the marker loops through all stops. With the reduced motion setting turned on in the operating system, the marker does not loop.

The plan, the chapters, and the steps are in `src/content.ts`. The marker timing is in `src/lib/journey.ts`. The colors and type are tokens at the top of `src/style.css`. `DESIGN.md` at the repository root records the design system.

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
