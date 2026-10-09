# LEVEL YOU V2 — Product and creative brief
Date: 2026-10-09. Status: design proposal, NOT validated.

## Product promise
A group of friends uploads 5–15 photos and short memories to gift a funny, surprising, emotionally moving birthday experience, delivered by link and culminating in a premium shareable video. Target retail price EUR 14.90–15.00 (final price subject to validation). Owner anonymity is mandatory.

## Creative concept: The Birthday Challenge
1. Cold open: cinematic trailer announcing an extraordinary protagonist.
2. Five personalized mini-challenges or reveals, driven by real memories and consensual inside jokes.
3. Comedic escalation with surprising but respectful narration.
4. Emotional pivot: friends' appreciation and birthday message.
5. Premium final film (target 45–75 seconds), shareable independently.

## Non-negotiables
- Preserve real faces: use original photos, reframing, parallax and typography; no face replacement or generative alteration by default.
- Licensed music and sound effects; avoid unlicensed copyrighted tracks.
- Preview before payment and customer approval of final narrative where feasible.
- No public personal photo URLs, no PII in GitHub, logs, analytics or client-side secrets.
- Explicit uploader confirmation of rights/consent, especially for minors; retention/deletion policy, GDPR compliance and vendor data-processing review before launch.
- Mobile-first playback and audio on iOS/Android; caption support.
- Full automation including rendering, retry, delivery, expiry and refunds must be tested, not assumed.
- No new spend without owner approval.

## Priority prototype
Create one gold-standard 60-second demo from permissioned sample photos: opening, 3 comic beats, emotional close. Compare two licensed music directions, verify sound levels and playback on iPhone/iPad and Android. Require human qualitative panel (at least 10 target buyers) before implementing checkout.

## Acceptance gates
G1 Creative: >=8/10 median perceived quality and >=7/10 median desire-to-share in blind target-buyer panel; willingness-to-pay at EUR 14.90 explicitly measured (not inferred).
G2 Technical: face integrity, correct photo ordering, export/audio verified on target devices, no broken links, reliable rendering across test cases.
G3 Security: private media storage, access controls, deletion, payment-webhook verification, rate limiting, privacy/legal review.
G4 Unit economics: measured total variable cost per delivered order including render, storage, payment, failed jobs and support; target contribution margin >=65% after VAT/payment/variable costs (subject to model).
G5 Operational: timed full order-to-delivery dry runs, exception rate and human support time consistent with <5 hours/week at expected volume.

## Immediate backlog
P0 Storyboard + copy + music art direction; test video pipeline without paid services; validate source-photo rights.
P0 Audit existing code for photo handling and link/privacy behavior.
P1 Build deterministic render pipeline and QA fixture library.
P1 Private storage, secure tokenized delivery, expiry and deletion.
P1 Checkout/payment sandbox and webhook tests; never accept live payments before all gates.
P2 A/B test landing page and price with target buyers.

## Status
Existing five-memory website is a functional prototype per project history. Premium video generation, privacy, payment, automation and commercial demand are unvalidated. This document does not claim implementation.
