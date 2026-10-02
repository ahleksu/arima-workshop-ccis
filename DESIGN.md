---
name: ARIMA Workshop
description: A line map for a one-hour lecture. Two lines, twelve stops, white enamel signs on a pale platform.
colors:
  lecture-blue: "#1257d6"
  lecture-blue-dark: "#0d44b0"
  handson-orange: "#e4570f"
  handson-text: "#b33f00"
  demos-green: "#0c7a4b"
  reference-plum: "#7a2d8e"
  platform-ground: "#eef1f4"
  enamel-white: "#ffffff"
  signal-ink: "#10151b"
  ink-secondary: "#3d4651"
  rule: "#c3cad2"
  rule-strong: "#6b7683"
  error-red: "#b3261e"
typography:
  sign:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 1.5rem + 5vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  statement:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2.2vw, 3.4rem)"
    fontWeight: 700
    lineHeight: 1.08
  title:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "Barlow, system-ui, Arial, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 600
    lineHeight: 1.2
rounded:
  sm: "8px"
  md: "12px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "24px"
  lg: "44px"
components:
  button-lecture:
    backgroundColor: "{colors.lecture-blue}"
    textColor: "{colors.enamel-white}"
    rounded: "{rounded.md}"
    padding: "10px 22px"
    height: "52px"
  button-lecture-hover:
    backgroundColor: "{colors.lecture-blue-dark}"
  button-handson:
    backgroundColor: "{colors.handson-orange}"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.md}"
    padding: "10px 22px"
    height: "52px"
  button-quiet:
    backgroundColor: "{colors.enamel-white}"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.md}"
    padding: "10px 22px"
    height: "52px"
  chip-time:
    backgroundColor: "{colors.enamel-white}"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.pill}"
    padding: "2px 14px"
  term-pill:
    backgroundColor: "{colors.enamel-white}"
    textColor: "{colors.reference-plum}"
    rounded: "{rounded.pill}"
    padding: "2px 14px"
---

# Design System: ARIMA Workshop

## Overview

**Creative North Star: "The Line Map"**

The hour is a journey on two lines. The Lecture line has seven stops. The Hands-on line has five. They meet at one interchange at minute 20. Every screen is a station sign: white enamel on a pale platform, near-black ink, a thick colored line, round stops. The design is made for a classroom projector and for a phone, in daylight and ceiling light. It is light mode only.

The system refuses the slide-deck look and the documentation-sidebar look. A page never decorates. Color names a line, and a line names a part of the hour. Type is signage: condensed, heavy, plain.

**Key Characteristics:**
- Four line colors with fixed meaning: blue for the lecture, orange for the hands-on, green for demos, plum for reference.
- One type family in two widths: Barlow Semi Condensed for signs and Barlow for reading.
- Round stops on a thick line (10px) appear on the map, the lecture bar, the hands-on rail, and the navigation.
- Hairline rules, small radii, no shadows at rest.
- One authored motion: the current stop arrives, and the statement rises.

## Colors

The palette is Full palette: four named line roles on a cool white and grey ground. The lines never share a meaning.

### Primary
- **Lecture Blue** (#1257d6): the lecture line, primary buttons, links, the numbered beat dots, the Ask box border. White text on it has a 6.25:1 contrast.

### Secondary
- **Hands-on Orange** (#e4570f): the hands-on line, rails, and the Colab buttons. Text on an orange fill is Signal Ink (4.95:1). Orange text on white uses Hands-on Text (#b33f00, 5.79:1).

### Tertiary
- **Demos Green** (#0c7a4b): the demos line and every "good" zone or revealed answer.
- **Reference Plum** (#7a2d8e): the glossary line and every glossary term pill.

### Neutral
- **Platform Ground** (#eef1f4): the page field, a cool pale grey.
- **Enamel White** (#ffffff): every sign, panel, chip, and input.
- **Signal Ink** (#10151b): headings and body text. Secondary text is Ink Secondary (#3d4651, 9.57:1 on white).
- **Rule** (#c3cad2): decorative hairlines. **Rule Strong** (#6b7683): input and button borders (4.6:1 on white).

### Named Rules
**The One Line, One Meaning Rule.** A line color names exactly one part of the hour. Never use blue for a hands-on item or orange for a lecture item.
**The Never Color Alone Rule.** Every state that color carries also has a word or a shape: a stop name, a ring, a "now" label, "Good" and "Bad" text inside the p-value zones.

## Typography

**Display Font:** Barlow Semi Condensed (with Arial Narrow, Arial)
**Body Font:** Barlow (with system-ui, Arial)

**Character:** Highway and transit signage. Condensed, heavy, and plain at display sizes. Open and even at reading sizes. Both fonts are bundled with the site through @fontsource, so no network call is made.

### Hierarchy
- **Sign** (700, clamp 2.75rem to 5.5rem, 1.1): page titles. A 6rem line-color bar sits under it. The lecture page uses a smaller sign (clamp 2rem to 3.1rem) with a numbered dot and no bar.
- **Statement** (700, clamp 2rem to 3.4rem, 1.08): the one sentence that the room keeps from each beat.
- **Title** (700, 1.75rem): section headings.
- **Body** (400, clamp 1.0625rem to 1.25rem, 1.55): reading text. Support text is larger (1.15rem to 1.4rem). Measure stays at or under 44rem.
- **Label** (600, 1.05rem): chips, minutes, buttons (700, 1.2rem). Minutes use tabular numerals.

### Named Rules
**The Plain Number Rule.** Numbers in running text use the plain zero of Barlow. Do not switch to a slashed-zero face for body text.

## Layout

A single column on phones and a two-column stage on desktop (5 parts text, 7 parts visual) from 62rem. The container is 76rem wide with a 16px to 40px gutter. The home map is two horizontal lines on desktop and one vertical line on phones, joined by the interchange. Spacing rhythm: 8, 12, 24, 44px, with more space above a heading than below it.

## Elevation & Depth

Flat at rest. Depth comes from white signs on a grey ground and from 1px hairlines. The only shadow-like device is the double ring around the current stop and the interchange: a stack of zero-blur rings in the sign white and the line color. It marks "you are here" and nothing else.

### Named Rules
**The Flat Sign Rule.** Panels have a 1px rule or a 2px colored border, never both a border and a soft shadow.

## Shapes

Small radii: 8px for controls, 12px for panels and buttons, full pills for chips and term pills. Stops are circles with a thick colored border and a white center. Lines are 10px bars with square joins.

## Components

### Buttons
- **Shape:** 12px radius, 52px tall, 700 weight at 1.2rem.
- **Lecture:** Lecture Blue fill, white text. Hover darkens to #0d44b0.
- **Hands-on:** Hands-on Orange fill, Signal Ink text.
- **Quiet:** white fill, 2px Rule Strong border, ink text. Hover turns the border ink.
- **Focus:** 3px Signal Ink outline, 3px offset, on every interactive element.

### Stops and lines
Round stops sit on a 10px bar in the line color. Done stops are filled. The current stop is larger with a double ring. Upcoming stops are hollow with a grey border. The clock marks the current stop with "now".

### Chips and term pills
Time chips are white pills with a 2px border in the page line color. Term pills are white with a 2px plum border and plum text. Hover fills the pill.

### Ask box
A white panel with a 2px Lecture Blue border. It holds the question in a 1.45rem sign type and a "Show the answer" button. The revealed answer is Demos Green.

### Navigation
Five links, each with a ring in its line color. The current page has a filled ring and a 4px bottom bar in that color.

## Do's and Don'ts

### Do:
- **Do** use a line color for one meaning only.
- **Do** keep one idea per lecture screen. The statement leads, the visual follows.
- **Do** label illustrative data as synthetic where a viewer can take it for real.
- **Do** keep contrast at 4.5:1 or better for body text and 3:1 for large text and control borders.
- **Do** keep all pages light. Set `color-scheme: light`.

### Don't:
- **Do not** add dark mode or follow `prefers-color-scheme`.
- **Do not** put a kicker or eyebrow label above a heading.
- **Do not** use a colored side stripe thicker than 1px on a panel.
- **Do not** use a gradient, a glass effect, or a soft shadow on a sign.
- **Do not** stand glyphs or emoji in for icons. Use the drawn icons in `web/src/ui.ts`.
