# LevelYou — Handoff from Sprint 3 to Sprint 4

**Handoff date:** 2026-10-07  
**Sprint 3 status:** DONE / FROZEN  
**Next sprint:** Sprint 4 — Video Experience

## 1. Purpose of this handoff

Sprint 3 proved the end-to-end product workflow through final video generation. Sprint 4 must not reopen the Creator architecture unless a video requirement absolutely requires it.

The starting point for Sprint 4 is the frozen Sprint 3 codebase after:
- Creator state/isolation fixes;
- final-message timing fix;
- question wrapping/length limits;
- Video Memories (0–10 extra photos);
- Sprint 3 checkout/API isolation;
- final-video sequence using 5 game photos + optional video-only memories;
- real-device iPad video-generation validation.

## 2. Frozen architecture inherited from Sprint 3

Frontend:
- static GitHub Pages;
- `index.html`;
- `smart-fast-sprint3.js`;
- `smart-video-sprint3.js`;
- `smart-checkout-sprint3.js`;
- `play-sprint1.html` currently contains the recipient Player and client-side video renderer.

Backend:
- Supabase Postgres `orders`;
- private Supabase Storage `levelyou-photos`;
- Edge Functions:
  - `smart-memory`;
  - `super-api-sprint3`;
  - `get-game-sprint3`;
  - `checkout-sprint3-preview`;
  - Stripe webhook remains part of the existing payment architecture.

Payment:
- Stripe Checkout;
- idempotent/reusable checkout behavior inherited from Sprint 2/3;
- paid game remains usable even if video generation fails.

## 3. Functional baseline that Sprint 4 must preserve

Creator:
1. choose 5 game photos;
2. create/edit 5 questions;
3. optional per-photo AI suggestion;
4. photo framing;
5. review;
6. optional final dedication;
7. optional Video Memories with 0–10 extra photos;
8. checkout.

Recipient:
1. gift opening;
2. exactly 5 quiz questions;
3. final dedication;
4. CTA to create/watch final video;
5. save/share video.

Critical invariant:
**video-only memories must never enter the five-question quiz arrays.**

## 4. Video baseline at Sprint 3 close

The current video engine is client-side Canvas + MediaRecorder.

Sequence:
- branded intro;
- game memories 1–5;
- optional video-only memories;
- final dedication/outro;
- preview;
- native save/share where supported.

The workflow works on the tested iPad, but the visual result is intentionally basic.

Known product-quality limitations accepted at Sprint 3 close:
- no music;
- limited transition variety;
- static/basic photo presentation;
- modest pacing/rhythm;
- limited cinematic treatment;
- portrait/landscape handling is functional rather than beautiful;
- titles and outro are serviceable, not premium;
- no beat synchronization;
- no AI photo animation.

These are Sprint 4 product goals, not Sprint 3 defects.

## 5. Sprint 4 objective

Turn the current functioning video into a result that materially increases willingness to pay for the €14.90 product.

Target feeling:
**“I would keep/share this” rather than merely “the video works.”**

Recommended Sprint 4 work order:
1. define target duration for 5 / 10 / 15-photo videos;
2. redesign intro/outro and visual hierarchy;
3. add photo motion (Ken Burns / pan / controlled zoom);
4. improve transitions;
5. establish pacing rules;
6. add music with a legally safe/licensed approach;
7. synchronize cuts/transitions to musical structure where feasible;
8. improve portrait and landscape composition;
9. test video generation, playback, save and share on iPad/iPhone;
10. only then consider optional higher-cost animation/AI effects.

## 6. Constraints for Sprint 4

- Keep the paid quiz independent from video success.
- Avoid heavy backend-rendering infrastructure unless client-side generation proves insufficient.
- Do not weaken private-photo handling.
- Do not expose permanent public photo URLs.
- Preserve ES / CA / EN.
- Preserve existing Creator behavior unless a video feature requires a change.
- Reliability on Apple mobile devices takes priority over decorative effects.
- Music licensing must be solved before shipping music publicly.
- Keep variable cost compatible with a €14.90 one-time price.

## 7. QA expectations

Before closing Sprint 4:
- 5-photo video;
- 10-photo video;
- 15-photo video;
- mixed portrait/landscape;
- long but valid dedication;
- ES / CA / EN;
- iPad Safari;
- iPhone Safari;
- preview;
- save;
- native share;
- video failure leaves quiz/share link intact.

## 8. Frozen refs and rollback

The Sprint 3 frozen refs are created after this handoff is committed:

- `v3-sprint3-complete`
- `archive/sprint3-closed-2026-10-07`
- `checkpoint/sprint3-complete`

Sprint 4 development branch:

- `sprint4-video-experience`

All four refs must initially point to the exact same final Sprint 3 commit.

## 9. First action tomorrow

Start from `sprint4-video-experience`.

Do not begin by coding.

First compare the current Sprint 3 video with the desired final experience and lock:
- target length;
- soundtrack strategy;
- photo duration;
- transition language;
- title treatment;
- portrait/landscape rules;
- intro/outro structure.

Then implement the smallest visual upgrade that produces a clearly perceptible quality jump without changing Creator/payment architecture.
