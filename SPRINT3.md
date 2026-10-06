# LevelYou Sprint 3 — Video Memories

**Status:** IN DEVELOPMENT  
**Started:** 2026-10-06  
**Base:** `v2-sprint2-complete` at commit `0d98a87dea21d31d33d223d75f7475dec03bc92f`  
**Development branch:** `sprint3-video-memories`

## Objective

Increase the emotional value of the final video without making the five-question game slower or more complicated to create.

## Product scope

- Preserve the existing 5 game photos and 5-question Fast Creator.
- After game review, offer an optional Video Memories step before checkout.
- Buyer may add 0–10 extra photos used only in the final video.
- Extra photos require no question, answer, context or AI call.
- Extra photos can be reordered, removed and manually framed.
- Safe full-photo framing is the default.
- Final video sequence is:
  1. the five game memories in their existing order;
  2. the optional extra video memories in the order chosen by the buyer.
- The paid quiz remains usable even if video generation fails.
- ES / CA / EN remain supported.

## Data model

Game memories stay unchanged:

- photo
- context
- framing
- question
- 3 answers
- correct answer

Video-only memories are separate:

- photo path
- order
- framing

The order payload uses:

- `photo_paths` for the five game photos;
- `video_photo_paths` for optional video-only photos;
- `video_memories` for order/framing metadata.

Video-only photos are not inserted into the existing five-question arrays.

## Backend

Sprint 3 uses isolated preview endpoints so the Sprint 2 backend stays available for rollback:

- `super-api-sprint3`
- `get-game-sprint3`
- `checkout-sprint3-preview`

Server validation:

- exactly five game memories/questions;
- 0–10 video-only memories;
- total upload count must equal five plus video-only count;
- supported image MIME types only;
- framing bounds validated server-side;
- bounded request/game-data size;
- request ID retains retry/idempotency behavior.

## Creator

New module:

- `smart-video-sprint3.js`

Behavior:

- intercepts the final purchase CTA only for the full five-memory product;
- opens the optional Video Memories step;
- supports multi-select, sequential image preparation, reorder, remove and framing;
- skip remains one tap when the buyer wants no extra photos.

## Checkout

New module:

- `smart-checkout-sprint3.js`

Behavior:

- optimizes game photos and video-only photos sequentially;
- sends the separate video-memory metadata model;
- uploads all signed assets;
- opens the isolated Sprint 3 Stripe preview checkout;
- preserves request UUID retry safety.

## Player and final video

`play-sprint1.html` on the Sprint 3 branch uses `get-game-sprint3`.

The quiz still consumes only `DATA.items` (the original five memories).

Final video generation builds a separate sequence:

- 5 game photos;
- optional `DATA.videoMemories`.

Therefore extra photos never alter scoring, questions or Player progress.

## Out of scope

Still deferred:

- music / licensed tracks;
- richer transition library;
- AI photo animation;
- retention/deletion automation;
- analytics and monitoring;
- full legal/privacy launch package.

## Definition of done

Sprint 3 development is complete when:

1. optional Video Memories step works with 0–10 extra photos;
2. reorder/remove/framing persist into checkout payload;
3. backend validates and stores separate video-only memory metadata;
4. paid API returns signed extra-photo URLs without affecting the five quiz items;
5. final video renders game photos plus extra photos;
6. Sprint 2 Creator, Fast Creator, framing, quiz and ending remain functionally unchanged;
7. static automated QA is green;
8. isolated public RC is smoke-tested;
9. physical iPad/iPhone acceptance verifies photo picker, touch framing, video generation and save/share.

Production promotion remains a separate release decision.


## Current implementation checkpoint — 2026-10-06

Implemented on `sprint3-video-memories`:

- optional Video Memories step after review and before checkout;
- 0–10 extra video-only photos;
- reorder, remove and manual framing;
- separate Sprint 3 checkout client;
- isolated Sprint 3 order API and paid-game API;
- isolated Sprint 3 Stripe preview checkout;
- final-video sequence combines 5 game memories + optional extra memories;
- starting a new full gift clears previous extra-photo state.

Backend preview functions active:

- `super-api-sprint3` — version 3;
- `get-game-sprint3` — version 1;
- `checkout-sprint3-preview` — version 1.

Static validation completed:

- external JS syntax: PASS;
- creator inline JS syntax: PASS;
- player inline JS syntax: PASS;
- duplicate HTML IDs: none;
- frozen Sprint 2 base remains `0d98a87dea21d31d33d223d75f7475dec03bc92f`.

Isolated public QA assets have been published under:

`https://levelyougift.github.io/levelyou/qa/sprint3-rc/`

Production root files on `main` were not replaced.

Rollback / review checkpoint:

`checkpoint/sprint3-video-memories-rc1`

Remaining release gate:

- public-route smoke once GitHub Pages deployment is visible;
- physical iPad/iPhone acceptance using `QA_IPAD_SPRINT3.md`;
- one controlled paid-path test if payment certification is desired.

Sprint 3 is implemented as an RC, not yet production-promoted.
