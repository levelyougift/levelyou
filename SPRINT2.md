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
