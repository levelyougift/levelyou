# LevelYou — Product Viability & Launch Gate

**Purpose:** keep LevelYou sellable, reliable and operationally simple while preserving a premium customer experience.

## Product rule

A feature is worth shipping only when it improves at least one of these without creating disproportionate risk in the others:

1. **Customer value** — the gift feels personal and worth €14.90.
2. **Functional reliability** — creation, payment, delivery and playback work consistently.
3. **Technical simplicity** — the stack remains understandable and supportable.
4. **Unit economics** — variable cost stays comfortably below price.
5. **Operational scalability** — normal orders do not require manual intervention.

A visually impressive feature that makes payment, media processing or mobile compatibility fragile is not a premium feature.

## Current architecture to preserve

- Static frontend on GitHub Pages.
- Supabase Edge Functions for business logic.
- Supabase Postgres for orders.
- Private Supabase Storage for photos.
- Stripe Checkout for payment.
- OpenAI only for Smart Creator generation.
- Client-side final-video generation while it remains reliable enough on target Apple devices.

Avoid adding a new permanent service unless it solves a launch-blocking problem that the current stack cannot solve simply.

## MUST be green before public sales

### Creation
- Creator loads reliably on iPhone/iPad Safari and mainstream desktop browsers.
- Five-photo upload works with normal phone photos.
- Client photo optimization prevents unnecessarily large uploads.
- Smart Creator succeeds or fails gracefully without blocking the user.
- Creator edits, tone and final dedication remain intact through checkout.

### Payment
- One order cannot accidentally generate multiple active checkout sessions.
- Retried network requests must not create duplicate orders during the initial order call.
- Stripe webhook signature verification remains enabled.
- A paid customer can access the game even if webhook delivery is delayed.
- Cancelled payment returns to a usable creator experience.

### Delivery / recipient
- Paid share token opens only paid orders.
- Photos remain private and are delivered using temporary signed URLs.
- Recipient can play all five questions without authentication.
- Temporary Stripe/Supabase propagation delays are retried automatically before showing an error.
- Sharing via native share sheet / WhatsApp remains functional.

### Media
- Final video is an enhancement, not a single point of failure for the paid game.
- Video generation failure must never destroy access to the game.
- iPhone/iPad save/share behavior must be tested on real devices before declaring the video production-ready.
- Do not add background music until the current video path is verified on Apple devices.

### Security / abuse
- Public write endpoints validate origin, method, payload shape and payload size.
- Database tables remain inaccessible directly from the public client.
- Storage bucket remains private and enforces supported image types and size limits.
- AI endpoint abuse protection must be in place before meaningful public traffic or paid acquisition.

### Operations
- Automated QA must run on Sprint 2 changes.
- There must be a documented rollback branch/checkpoint.
- Draft/expired-order and orphan-photo retention/deletion policy must exist before broad launch.
- Error monitoring must be good enough to distinguish payment, upload, AI and playback failures.

## SHOULD be green shortly after launch

- Simple funnel metrics: creator started → 5 photos selected → preview generated → checkout opened → paid → game opened.
- Automatic cleanup of abandoned drafts and orphaned photos.
- Customer-support recovery path for paid orders.
- Basic alerting for elevated 5xx rates.
- Device matrix expanded beyond the primary Apple flow.

## NOT NOW

Do not add these until core conversion and reliability are demonstrated:

- User accounts / passwords.
- Native iOS or Android apps.
- Heavy backend video rendering infrastructure.
- Complex animation pipelines.
- Multiple AI vendors.
- Full CMS/admin platform.
- Social network/community features.
- Complex subscriptions.
- Advanced analytics stack.
- Extra infrastructure solely for architectural elegance.

## Current hardening completed

- Frozen Sprint 1 rollback baseline.
- Separate Sprint 2 development branch and checkpoint.
- Premium Creator / Player / Final Video presentation.
- Order payload validation and origin checks.
- Initial order-call idempotency via client request ID.
- Stripe Checkout reuse / idempotency.
- Stripe payment-status fallback when webhook propagation is delayed.
- Recipient retry window for transient post-payment propagation.
- Sequential client-side photo optimization for lower memory, bandwidth and Storage usage.
- Automated GitHub Actions QA for syntax, duplicate IDs, critical wiring and endpoint health.

## Current launch blockers

1. Real-device QA of the current Sprint 2 branch on iPad/iPhone Safari.
2. Full creator → Stripe → paid player end-to-end test using the Sprint 2 client.
3. Real-device video create / preview / save / share test.
4. Decide and implement lightweight AI abuse protection before public acquisition traffic.
5. Define retention and cleanup for abandoned draft orders/photos.

Until those five items are green, Sprint 2 should not replace the stable public release.
