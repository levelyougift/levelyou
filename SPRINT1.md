# LevelYou Sprint 1 — Smart Creator

**Status:** COMPLETE / READY TO FREEZE  
**Closed:** 2026-10-06  
**Frozen baseline preserved:** `mvp-v1-locked` at `36fcf9a170a24f48f9f326bd0b62600ab2893245`  
**Development branch:** `v2-sprint1-smart-creator`  
**Frozen checkpoint:** `v2-sprint1-complete`

## Scope delivered

- AI-assisted analysis of 1 or 5 uploaded memories.
- Automatic suggested context/caption for each photo.
- Context is optional and always editable by the creator.
- Grounded AI behavior: do not invent identities, relationships, exact locations, dates, private traits or sensitive attributes.
- Automatic quiz generation with exactly 3 answers and one correct answer.
- Tone selector:
  - Fun / Divertido (default)
  - Cheeky / Cómplice
  - Emotional / Emotivo
  - Elegant / Elegante
- Question prompt redesigned to avoid naive school-test/computer-vision questions.
- One visual pass per photo batch. Later changes to context, language or tone regenerate questions using text only.
- ES / CA / EN support, including question regeneration when language changes.
- Creator edits are preserved.
- AI-generated personalized final dedication, editable by the creator.
- Dedication stored in `game_data`, returned by `get-game-sprint1`, shown after the quiz and used as the final video message.
- Long dedications use a smaller video font and more lines to avoid truncation.
- Timeouts:
  - visual analysis: 40 s
  - text regeneration: 20 s
- One automatic client retry for transient 429/5xx/network failures, then graceful fallback.
- Dedicated Sprint 1 checkout route and final player route.
- Payment remains disabled on the public QA creator page.

## Canonical Sprint 1 components

### Frontend
- `index.html` — Sprint 1 release candidate creator on this branch.
- `smart-sprint1.js` — Smart Creator logic.
- `smart-checkout-sprint1.js` — order/upload/checkout integration.
- `play-sprint1.html` — Sprint 1 final game and video player.

### Supabase Edge Functions
- `smart-memory` — AI visual analysis + text-only question regeneration.
- `checkout-sprint1` — Sprint 1 checkout routing.
- `get-game-sprint1` — paid game retrieval including dedication.
- `app-sprint1` — redirect to current QA creator.
- `play-sprint1` — redirect to current QA player.

## QA completed

Automated QA validates:
- public Sprint 1 page and JS assets load;
- JavaScript syntax;
- Smart Memory health and API key configuration;
- checkout configuration and success/cancel targets;
- real 1-image AI analysis;
- real 5-image AI batch analysis;
- text-only regeneration for 5 memories;
- exact 3-answer structured output.

One-time end-to-end dedication QA also validated:
- dedication stored in a temporary paid order;
- `get-game-sprint1` returned the exact dedication and 5 game items;
- temporary order deleted after the test.

Latest clean automated QA run after removing the temporary token: GitHub Actions run `37501801661` — SUCCESS.

User acceptance on iPad/Safari:
- creator loads;
- automatic descriptions are high quality;
- tone/personality flow works well;
- Sprint 1.2 accepted as functioning very well.

## Performance observed in QA

Synthetic CI measurements:
- text-only regeneration of 5 questions: about 5 s in observed run;
- 5-image visual batch: about 12 s in observed run.

These are observed QA timings, not contractual SLAs.

## Explicitly not part of Sprint 1

Moved to later sprints:
- premium visual redesign / onboarding / transitions — Sprint 2;
- extra video-only photos — Sprint 3;
- AI animation of hero photos — Sprint 4;
- full go-live hardening, legal/privacy/deletion/monitoring and broad device matrix — Sprint 5.

## Known release note

The existing MVP Stripe payment path had already completed a real E2E payment before Sprint 1. The Sprint 1 checkout function reuses the same Stripe session logic with different success/cancel targets. Its configuration and routing are QA-verified. A new live payment was not completed during Sprint 1 closeout.

## Branch policy

- Never modify `mvp-v1-locked`.
- Sprint 2 must branch from `v2-sprint1-complete`.
- Do not promote to production `main/index.html` until the next approved release decision.
