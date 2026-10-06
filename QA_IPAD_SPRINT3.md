# Sprint 3 — iPad / iPhone Acceptance Test

Use the isolated QA release candidate:

https://levelyougift.github.io/levelyou/qa/sprint3-rc/

**Important:** checkout uses the existing Stripe configuration and may create a real payment. Do not complete payment unless intentionally testing the paid path.

## Core acceptance path

1. Open the Sprint 3 QA Creator on Safari.
2. Create the normal five-photo / five-question game.
3. Confirm framing still works for the five game photos.
4. Review the game.
5. Tap the €14.90 CTA.
6. Confirm the optional Video Memories step appears before checkout.
7. First test **Continue without adding** and confirm checkout opens normally.
8. Repeat with extra photos:
   - add 1 photo;
   - add multiple photos;
   - reach 10 extra photos;
   - confirm an 11th cannot be added.
9. Reorder at least three extra photos.
10. Remove an extra photo.
11. Adjust framing on one portrait and one landscape extra photo.
12. Continue to checkout.

## Paid-path acceptance

After one intentional payment:

- Player opens successfully.
- Quiz still contains exactly five questions.
- Extra video photos never appear as quiz questions.
- Ending and dedication remain unchanged.
- Tap **Watch our video**.
- Final video contains:
  1. five game memories;
  2. the extra video memories in the chosen order.
- Saved framing is respected.
- Video preview plays.
- Native save/share works.
- If video generation fails, replay and share-link functionality still work.

## Regression checks

- ES / CA / EN remain usable.
- No mandatory AI step is reintroduced.
- AI suggestion still affects only the selected game question.
- Game-photo framing still persists through Player/video.
- Cancelled checkout can resume without rebuilding the order.
- Starting a new LevelYou clears the previous gift's extra video photos.

## Stop-ship defects

- extra photos alter the five-question game;
- an order can exceed 10 extra photos;
- reorder shown in Creator differs from final video order;
- paid Player cannot open because extra-video media fails;
- iPad/Safari freezes during normal 5 + 10 photo preparation;
- duplicate Stripe sessions/orders appear on retry;
- private photos become permanently public.

Production root must not be promoted until this physical-device pass is green.
