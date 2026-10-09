# LEVEL YOU — release blockers (2026-10-09)
Status: CODE REVIEW ONLY; no end-to-end browser/device test executed.
Source reviewed: main/index.html, build 2026-10-05-r8. Do not launch.

## Observed
1. makeQuestion() generates keyword-template questions, not personalized AI storytelling.
2. Full builder requires exactly five photos; 10/15 photos not implemented.
3. Photo reading uses browser FileReader data URLs; claim of private server storage is unverified.
4. Translation strings claim Stripe automatic activation; integration is not verified.
5. Final video and private share link promises are not verified end to end.
6. Upload MIME checks alone do not establish safe image processing; size/decode/error handling needs testing.

## Required tests
- Functional: ES/CA/EN, 1/5-photo flows, editing, navigation, reload, unsupported/large files.
- Media: H.264/AAC ffprobe and decode; actual iOS/Android playback; sound and face fidelity.
- Security: private storage, expiring access, upload limits, consent, retention and deletion, webhook verification.
- Business: actual variable costs, support time, blind buyer quality ratings, willingness to pay EUR 14.90.

Do not launch, collect payment or promise automation until all gates have dated evidence. Do not incur costs without approval.
