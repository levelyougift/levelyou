-- LEVEL YOU V3 isolated draft: NOT DEPLOYED
create table if not exists public.v3_gifts (
 id uuid primary key default gen_random_uuid(),
 access_token_hash text not null unique,
 owner_secret_hash text not null unique,
 status text not null default 'draft' check (status in ('draft','ready','revoked')),
 recipient_name text not null check (char_length(recipient_name) between 1 and 40),
 memory_text text not null check (char_length(memory_text) between 1 and 300),
 detail_text text not null default '' check (char_length(detail_text) <= 130),
 dedication_text text not null check (char_length(dedication_text) between 1 and 400),
 feeling text not null check (feeling in ('gracias','aventura','amor')),
 photo_path text,
 expires_at timestamptz not null,
 revoked_at timestamptz,
 created_at timestamptz not null default now(),
 constraint v3_expiry_after_creation check (expires_at > created_at)
);
alter table public.v3_gifts enable row level security;
revoke all on public.v3_gifts from anon, authenticated;
create index if not exists v3_gifts_expires_at_idx on public.v3_gifts (expires_at);
-- Access only through a server-side function with service role and token verification.
-- A separate scheduled cleanup process must be implemented before production use.
