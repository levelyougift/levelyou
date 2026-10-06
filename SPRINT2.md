# LevelYou Sprint 2 — Premium Experience

**Status:** STARTED  
**Started:** 2026-10-06  
**Base:** `v2-sprint1-complete` at commit `42af9f8f9525d4539f90379073879f778528b5f9`  
**Frozen Sprint 1 archive:** `archive/sprint1-closed-2026-10-06`  
**Development branch:** `sprint2-premium-experience`

## Sprint objective

Make the complete LevelYou experience feel premium and clearly worth the current €14.90 price while preserving the functionality and reliability accepted at the end of Sprint 1.

Sprint 2 is an experience and presentation sprint, not a redefinition of the Smart Creator logic.

## Scope

### 1. Premium visual redesign
- Raise the perceived quality of the creator and player interfaces.
- Improve hierarchy, typography, spacing, cards, controls and visual consistency.
- Keep the product mobile-first and especially solid on iPad/Safari.

### 2. Onboarding / wizard
- Turn creation into a clearer guided journey.
- Make the next action obvious at every step.
- Reduce the feeling of filling in a form and increase the feeling of creating a gift.

### 3. Progress and feedback
- Add clear progress through the creation flow.
- Improve loading, processing and completion feedback.
- Preserve Sprint 1 timeout, retry and fallback behavior.

### 4. Premium game/player experience
- Redesign the game presentation without changing the validated quiz structure.
- Improve question, answer, reveal and transition states.
- Keep the final dedication as an important emotional payoff.

### 5. Premium ending
- Redesign the final screen so the experience has a stronger sense of completion.
- Integrate the dedication naturally into the closing sequence.

### 6. Premium final video
Improve presentation of the existing final video with:
- stronger intro;
- motion;
- better text treatment;
- transitions;
- music;
- final dedication.

## Sprint 1 functionality that must remain intact

- 1- or 5-memory Smart Creator.
- Automatic visual analysis and editable contexts.
- Exactly 3 answers per generated question.
- Tones: Divertido, Cómplice, Emotivo and Elegante.
- ES / CA / EN.
- Preservation of creator edits.
- Text-only regeneration after the visual pass.
- Dedication generation/editing/storage/player/video use.
- Existing retry, timeout and graceful-fallback behavior.
- Sprint 1 checkout and paid-game routing.

## Out of scope

Still reserved for later sprints:
- extra video-only photos — Sprint 3;
- AI animation of hero photos — Sprint 4;
- full go-live hardening, legal/privacy/deletion/monitoring and broad device matrix — Sprint 5.

## Guardrails

- Never modify `mvp-v1-locked`.
- Never modify the archived Sprint 1 branch.
- Do not promote Sprint 2 work to `main` until explicit release approval.
- Premium changes must not degrade the accepted Sprint 1 Smart Creator behavior.
- Build and validate incrementally so each meaningful UI change can be reviewed before moving to the next one.

## Definition of done

Sprint 2 is complete when:
1. the creator journey feels guided rather than form-like;
2. the visual system is coherent across creator, game and ending;
3. progress/loading states feel deliberate and polished;
4. the quiz interaction feels premium without changing its core rules;
5. the final dedication and video create a stronger emotional payoff;
6. Sprint 1 functional QA still passes;
7. iPad/Safari acceptance is successful;
8. the result is credible as a €14.90 paid gift experience.


## Checkpoint 2.1 — Premium Creator

**Implemented:** 2026-10-06  
**Commit:** `090dc22d3367ededf0084a6647c6316b3636ca20`

Delivered:
- premium visual layer over the existing Sprint 1 creator;
- stronger emotional landing copy and value framing;
- full €14.90 experience promoted to primary CTA;
- one-photo demo moved to secondary CTA;
- guided three-stage journey: Create → Personalise → Review;
- upgraded cards, inputs, upload areas, loading state and game preview;
- ES / CA / EN premium copy;
- responsive/mobile polish with iPad/Safari preserved as a priority.

Validation:
- inline JavaScript syntax OK;
- `smart-sprint1.js` syntax OK;
- `smart-checkout-sprint1.js` syntax OK;
- Smart Creator and checkout scripts remain referenced unchanged;
- create-order and Stripe checkout endpoints remain unchanged;
- diff from Sprint 1 is limited to `SPRINT2.md` and `index.html`.

Next planned checkpoint: **2.2 Premium Game & Reveal Experience**.


## Progress checkpoint — 2026-10-06

### Sprint 2.1 — Premium Creator
Implemented on `index.html`.

- Premium-first landing and value framing around the €14.90 experience.
- Full product creation is the primary CTA; 1-photo sample is secondary.
- Guided three-step journey: Create → Personalize → Review.
- Premium styling applied without changing Smart Creator endpoints or checkout mechanics.
- Existing `smart-sprint1.js?v=1.2` and `smart-checkout-sprint1.js?v=1.2` remain loaded.
- Static QA: embedded JavaScript syntax valid, no duplicate IDs, required creator/checkout anchors present.

Clean rebuild commit after QA correction: `31e7dffe562264cb1ec6ad1223230e9e303b94e6`.

### Sprint 2.2 — Premium Player
Implemented on `play-sprint1.html`.

- New gift-opening cover before question 1.
- Recipient name is used in the opening when available.
- New visual progress indicator across the five questions.
- Premium answer, card, score and dedication presentation.
- Final dedication has greater visual priority than the score.
- Existing paid-game API, answer logic, scoring, sharing and dedication retrieval preserved.

Commit: `8c2ce81be9e8f1201f181ba3d34cc9e2f8ef93f1`.

### Sprint 2.3 — Premium Final Video
Implemented within the existing local video-generation path.

- Premium intro treatment.
- Smoother fades between the five memories.
- Question text promoted as the emotional caption for each memory.
- More cinematic gradient treatment and subtle motion.
- Dedicated closing treatment for the final message / dedication.
- Existing `canvas.captureStream` + `MediaRecorder` mechanism preserved to avoid adding a new compatibility dependency.

Commit: `5bb7b81fbf5ccdf195e5ab52a6501ebae05fe7e8`.

### Current QA status

Compared with frozen Sprint 1 `42af9f8f9525d4539f90379073879f778528b5f9`, Sprint 2 currently changes only:

- `SPRINT2.md`
- `index.html`
- `play-sprint1.html`

No Sprint 1 Smart Creator JS file, checkout JS file, or frozen branch has been modified.

Static validation completed:
- creator embedded JS parses successfully;
- player embedded JS parses successfully;
- no duplicate HTML IDs detected in either page;
- Smart Creator and checkout script references remain intact;
- paid game API remains `get-game-sprint1`.

### Still pending before Sprint 2 close

- Real-device visual QA on iPad/Safari.
- Full creator → preview → checkout QA on the Sprint 2 branch.
- Paid-game player QA with a real or temporary token.
- Final-video playback/save QA on iPhone/iPad.
- Music/audio enhancement is not included yet; it should only be added after the current video path is confirmed stable on the target Apple devices.


## Viability hardening checkpoint — 2026-10-06

Product rule is now documented in `LAUNCH_GATE.md`: premium improvements must not create disproportionate reliability, cost or operational complexity.

### Backend hardening applied

Production Supabase functions were strengthened without changing the customer-facing architecture:

- `super-api`
  - strict GitHub Pages origin validation for browser writes;
  - JSON content-type and request-size checks;
  - validated five-memory / five-question game payload;
  - bounded text fields and dedication;
  - optional client request UUID so the initial order call can be safely retried without creating a second draft order.
- `checkout-sprint1`
  - reuses an existing open Stripe Checkout Session;
  - uses Stripe idempotency keys when a new session is required;
  - returns directly to the paid game when an order is already paid;
  - can confirm Stripe payment state if the database has not yet been updated by the webhook.
- `get-game-sprint1`
  - if an order is not yet marked paid, checks its Stripe Checkout Session as a fallback;
  - updates the order to paid when Stripe already confirms payment;
  - returns a retryable state for short payment-propagation delays.

The signed Stripe webhook remains the normal payment-confirmation path; Stripe lookup is a resilience fallback.

### Sprint 2 client hardening

New `smart-checkout-sprint2.js` replaces the Sprint 1 checkout client only on the Sprint 2 branch.

- Sequential image processing to reduce peak memory on iPhone/iPad.
- Photos are resized to a maximum edge of 1920px and encoded as JPEG at 0.88 quality when the browser can decode them.
- Original-file fallback remains available for unsupported image decoding, with a maximum fallback size.
- Initial order request uses a stable request UUID.
- Network POSTs use timeout + one controlled retry.
- Upload status copy distinguishes optimization, upload and payment phases.

The Sprint 1 checkout file remains unchanged.

### Recipient resilience

The Sprint 2 player automatically retries a short-lived `LevelYou not ready` response several times before showing an error. This protects the paid customer from normal Stripe/webhook propagation delays.

### Automated QA

Added `.github/workflows/sprint2-qa.yml`:

- checks syntax of Smart Creator and Sprint 2 checkout JavaScript;
- checks inline JS syntax in creator/player pages;
- rejects duplicate HTML IDs;
- verifies critical Sprint 2 wiring;
- checks live health endpoints for checkout and Smart Memory.

Initial automated run `37512818818` completed successfully, including live endpoint health.

### Infrastructure review

Current production review:

- Supabase project: active/healthy.
- `orders` and private Stripe config tables: RLS enabled with no public policies.
- photo bucket: private, supported image MIME types restricted, 15 MB object limit.
- database performance advisor: no current findings.
- existing test data includes draft/checkout-created orders; launch policy must define automatic retention/cleanup before broad public traffic.

### Current checkpoint

Rollback checkpoint after viability hardening:

`checkpoint/sprint2-viability-hardened`

This checkpoint is still not a production-release approval. Real-device and paid-flow acceptance remain launch gates.


## Browser-validated QA release candidate — 2026-10-06

The initial Supabase Edge Function HTML preview was rejected because hosted Edge Functions without a custom domain serve HTML responses as plain text in browsers. It is no longer the acceptance URL.

The valid Sprint 2 QA release candidate is now served as isolated static files through the existing GitHub Pages site:

`https://levelyougift.github.io/levelyou/qa/sprint2-rc/`

QA assets live only under `main/qa/sprint2-rc/`. The production root `main/index.html` and `main/play.html` remain byte-for-byte unchanged from before Sprint 2 QA.

Supporting QA backend:
- `checkout-sprint2-preview` — routes Stripe success/cancel to the isolated QA Creator/Player.
- production `smart-memory`, `super-api`, `get-game-sprint1` and signed Stripe webhook remain the functional backend baseline.

Automated verification:
- Sprint 2 static QA passes against the GitHub Pages RC, including HTML content type, build marker, JS syntax, duplicate IDs, critical wiring and live endpoint health.
- Chromium browser QA run `37519185605` completed successfully.
- Browser QA covers ES/CA/EN flags and copy, both landing CTAs, one-photo demo, five-photo flow, clear/reselect, Smart Creator mocked responses, memory navigation/editing, dedication, review navigation, checkout preparation with mocked order/upload/payment, cancellation recovery, payment resume, recipient Player, correct/wrong answers, sharing, replay and final-video UI controls.
- Real Stripe payment is intentionally not executed by automated QA.
- Real iPad/iPhone MediaRecorder/share-sheet behavior remains a physical-device acceptance gate.

Real-device acceptance procedure is documented in `QA_IPAD_SPRINT2.md`.

**Release policy:** no promotion of Sprint 2 to the production root until the physical iPad/iPhone acceptance test is completed.
