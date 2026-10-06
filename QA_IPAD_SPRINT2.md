# Sprint 2 — iPad / iPhone Acceptance Test

Use the staging preview:

https://levelyougift.github.io/levelyou/qa/sprint2-rc/

**Important:** this QA route uses the current LevelYou backend and Stripe configuration. Treat checkout as a potentially real payment unless Stripe explicitly shows test mode. The QA route is isolated from the production landing page and is marked noindex.

## Pass criteria

### 1. Landing
- Opens without horizontal scrolling or broken layout.
- Premium proposition is understandable in under 10 seconds.
- Main CTA is clearly the full €14.90 product.
- 1-photo sample is visibly secondary.
- ES / CA / EN switch works.

### 2. Start creator
- Tap **Crear su LevelYou · 14,90 €**.
- Step indicator shows the creation journey.
- Name / optional age fields are clear.
- Tone selector feels integrated, not technical.

### 3. Five-photo selection
- Select five normal iPhone/iPad photos in one batch.
- All five thumbnails appear in the expected order.
- No browser freeze or memory warning.
- Continuing to analysis remains responsive.

### 4. Smart Creator
- AI analysis finishes without manual intervention.
- Suggested contexts are believable and non-invasive.
- Contexts can be edited.
- Moving between all five memories is smooth.
- Tone change and question generation behave as expected.
- Final dedication is generated and editable.

### 5. Review
- Five questions are shown.
- Each has exactly three answers.
- Question navigation works.
- Editing a question preserves the change.
- The experience feels worth paying for before checkout.

### 6. Checkout preparation
- Press the final €14.90 CTA.
- Expected status progression:
  1. optimizing photos;
  2. preparing LevelYou;
  3. uploading memories;
  4. opening payment.
- No long frozen screen or browser crash.

### 7. Stripe cancel / return test
Before completing payment, use Stripe's back/cancel route once.

Expected:
- returns to staging;
- shows **No has perdido nada** / equivalent language;
- **Volver al pago** reopens checkout without re-uploading photos or rerunning AI.

### 8. Paid test
Only perform this when intentionally testing payment.

Expected:
- one checkout session for the order;
- after payment, Sprint 2 staging Player opens;
- brief payment propagation is handled automatically;
- no paid-but-blocked state.

### 9. Recipient player
- Gift-opening cover appears before question 1.
- Recipient name appears correctly.
- Five questions play normally.
- Progress moves from 1/5 to 5/5.
- Correct/wrong states are obvious but not harsh.
- Dedication is the emotional focus of the ending.

### 10. Final video
- Create video after finishing the game.
- Browser stays responsive.
- Preview plays.
- Text is not cropped.
- Dedication fits.
- Save/share works through the iOS/iPadOS share sheet.
- If video generation fails, game/share link remains fully usable.

## Stop-ship defects

Any of these blocks Sprint 2 release:
- photos fail to upload on normal iPhone/iPad images;
- AI regularly fails without a usable fallback;
- duplicate checkout/payment;
- paid customer cannot open game;
- private photo URLs are exposed permanently;
- game breaks after language/tone edits;
- browser crashes during photo processing or video generation;
- final video failure prevents use of the paid game.

## Non-blocking imperfections

These can be polished after functional acceptance:
- minor spacing differences between iPad and iPhone;
- wording refinements;
- subtle animation timing;
- richer music/audio;
- decorative visual effects.

Reliability wins over extra polish.
