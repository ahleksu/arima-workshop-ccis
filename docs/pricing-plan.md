# Pricing Plan (Not Implemented)

This document records ideas for charging for parts of this project in the future. The repository charges nothing today. It has no login, no payment code, and no billing. Every number below is a hypothesis to test, not a market result.

## Position

The code is MIT licensed and the content is CC BY 4.0, so anyone can reuse them. The project cannot charge for the material itself. It can charge for services that save time or reduce risk: delivery, support, and a hosted version.

## Possible offers

| Offer | Who pays | What they get | Needs to be built first |
| --- | --- | --- | --- |
| Free tier | Nobody | Repository, notebooks, slides, web explorer, Colab links | Nothing. It exists. |
| Workshop delivery | A department or school | A live session for a new audience with adapted examples | A shorter and longer agenda, and examples for the new field |
| Dissertation clinic | Students or a research office | Reviews of a forecasting chapter with the 8-question checklist | A review template and a booking process |
| Hosted explorer with saved work | Individuals or labs | Accounts, uploaded series, saved models, shareable reports | A backend, authentication, a privacy review, and support |
| Department license | A department | Hosted tier for many users, a single invoice, and training | Everything in the hosted tier, plus an admin view |

## Hypothetical price ranges to test

| Offer | Range to test | Basis |
| --- | --- | --- |
| Workshop delivery | One flat fee per session | Prices for a similar training session in your market |
| Dissertation clinic | A fee per chapter review | The hours per review at your hourly rate |
| Hosted explorer, individual | A low monthly fee | The monthly cost of hosting and support, divided by the expected users |
| Department license | A yearly fee per department | A multiple of the individual fee for a user cap |

Set no price until you complete the validation plan below.

## Validation plan

1. After the Oct 2 session, ask each attendee three questions: Did you run a notebook on your own data? What stopped you? Which offer, if any, do you value enough to pay for?
2. Count how many people finished notebook 06 on their own data within two weeks.
3. Offer a free pilot of one paid offer to two attendees. Record the time you spend and what they say.
4. Charge only after at least five faculty report real use on their own data.

## Risks

- Data privacy: a hosted tier stores uploaded data. In the Philippines, the Data Privacy Act of 2012 (Republic Act 10173) applies to personal data. Do not accept personal data without a privacy review.
- Support load: every paying user expects answers. Price the support time.
- Open license: a competitor can host the same code. Compete on service, trust, and local context.
- Institution rules: a school often needs an invoice, a purchase order, or a memorandum of agreement. Plan for the delay.

## Decision rule

Keep the project free and open until the validation plan shows demand. Then build the smallest paid offer that needs no backend, which is workshop delivery or the dissertation clinic.
