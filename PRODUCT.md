# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

CCIS faculty at one college, in one room, in one 60-minute session on Oct 2, 2026, 3 PM to 4 PM. They know Python and basic statistics. Most have never fit an ARIMA model. The presenter is the primary user during the first 20 minutes: the presenter teaches from the site on a projector. Attendees use it on a laptop or phone during the 40 minute hands-on and again at home.

## Product Purpose

The web explorer teaches ARIMA time series forecasting. It is the lecture screen for the first 20 minutes, the map for the 40 minute hands-on in Google Colab, and a reference after the session. Success is a faculty member who leaves able to fit, check, and forecast one series, and who knows which notebook to open next.

## Positioning

A teaching site that the presenter can walk through beat by beat with the keyboard, with working demos that run in the browser and no backend. A neighboring slide deck or course site cannot let the room move a coefficient slider and watch the ACF change.

## Operating Context

- Lecture: a laptop on a classroom projector, read from the back of a room. The presenter uses arrow keys. Room lighting is normal daylight and ceiling lights.
- Hands-on: each attendee has a laptop with Colab in one browser tab and this site in another.
- After the session: phone and laptop, read alone.
- Language: plain English, American spelling, written to the repository's unslop rules.

## Capabilities and Constraints

- Static site built with Vite, TypeScript, and bundled Plotly. No backend, no login, no analytics, no network call at runtime.
- Pages: Home with the session plan, Lecture (seven beats), Hands-on (three notebook blocks), Demos (stationarity, AR and MA simulator, ARIMA playground), Glossary (29 terms).
- Deployed to GitHub Pages under `/arima-workshop-ccis/` using hash routes.
- The user asked for light mode only. No dark mode.
- Terminology: beat (one lecture idea), block (one hands-on notebook), demo, glossary term.
- Open decision: none.

## Brand Commitments

Free and open. Code is MIT and content is CC BY 4.0. The project name is ARIMA Workshop for CCIS. No logo exists.

## Evidence on Hand

- The synthetic daily energy demand series in `data/` and its weekly export in `web/public/data/`. It is labeled synthetic wherever it is shown.
- Seven executed notebooks, with real outputs quoted in `docs/lecture-guide.md`.
- No testimonials, attendee numbers, or outcome data exist. Do not invent them.

## Product Principles

- The room reads from a distance: one idea per screen, large type, high contrast.
- Show the mechanism, not a claim: a slider moves and the plot changes.
- Every page answers "what do I do next" in one visible action.
- Plain words first, symbols second.
- Nothing needs a mouse. The lecture works with arrow keys and with touch.

## Accessibility & Inclusion

Text contrast must meet WCAG AA. Focus rings must be visible. Charts keep a plain-text summary. Respect reduced-motion. The page must work at 390 px wide.
