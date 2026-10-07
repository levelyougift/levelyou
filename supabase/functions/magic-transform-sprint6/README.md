# Sprint 6.4 Magic Transform

Server-side AI transformation for one LevelYou memory.

## Required secret
- `RUNWAYML_API_SECRET`

## Optional secrets
- `RUNWAY_IMAGE_MODEL` (default `gen4_image_turbo`)
- `RUNWAY_IMAGE_RATIO` (default `1080:1440`)

## Behaviour
- Uses memory #3 (index 2).
- One generation per order.
- Persists the generated image to the existing `levelyou-photos` bucket.
- Saves status/latency into `orders.game_data.magic_transform`.
- Any failure returns `status: fallback`; the recipient experience remains functional with the local Art Reveal.
