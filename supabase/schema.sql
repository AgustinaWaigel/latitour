-- Run in the Supabase SQL editor. Public read; writes only by the authenticated owner.
create table if not exists public.places (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid references auth.users(id) on delete set null,
 name text not null check (char_length(name) between 2 and 100),
 description text not null check (char_length(description) between 15 and 2000),
 category text not null check (category in ('gastronomia','alojamiento','actividades','transporte','servicios')),
 address text not null check (char_length(address) between 3 and 200),
 latitude double precision not null check (latitude between -90 and 90),
 longitude double precision not null check (longitude between -180 and 180),
 image_url text not null default '' check (image_url = '' or image_url ~ '^https://[^[:space:]]+$'),
 phone text not null default '' check (char_length(phone)<=30 and phone ~ '^[+0-9 ()-]*$'),
 whatsapp text not null default '' check (whatsapp = '' or whatsapp ~ '^\+?[0-9]{8,15}$'),
 hours jsonb not null default '["","","","","","",""]'::jsonb check (jsonb_typeof(hours)='array' and jsonb_array_length(hours)=7),
 status text not null default 'unknown' check (status in ('open','closed','unknown')),
 availability text not null default 'ask' check (availability in ('available','limited','unavailable','ask')),
 status_updated_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 is_demo boolean not null default false
);
create index if not exists places_owner_idx on public.places(owner_id);
create index if not exists places_category_state_idx on public.places(category,status,status_updated_at);
alter table public.places enable row level security;
grant select on public.places to anon, authenticated;
grant insert, update, delete on public.places to authenticated;
drop policy if exists "Public can read places" on public.places;
create policy "Public can read places" on public.places for select using (true);
drop policy if exists "Owners insert places" on public.places;
create policy "Owners insert places" on public.places for insert to authenticated with check ((select auth.uid())=owner_id);
drop policy if exists "Owners update places" on public.places;
create policy "Owners update places" on public.places for update to authenticated using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
drop policy if exists "Owners delete places" on public.places;
create policy "Owners delete places" on public.places for delete to authenticated using ((select auth.uid())=owner_id);
-- The database clock is authoritative; clients cannot set timestamps into the future.
create or replace function public.stamp_place_update() returns trigger language plpgsql set search_path = '' as $$
begin
 if TG_OP = 'INSERT' then
   new.updated_at := now();
   if current_user in ('anon','authenticated') then
     new.status_updated_at := now();
     new.is_demo := false;
   end if;
 else
   new.updated_at := now();
   if new.status is distinct from old.status or new.status_updated_at is distinct from old.status_updated_at then
     new.status_updated_at := now();
   end if;
   if current_user in ('anon','authenticated') then new.is_demo := old.is_demo; end if;
 end if;
 return new;
end;
$$;
drop trigger if exists stamp_place_update on public.places;
create trigger stamp_place_update before insert or update on public.places for each row execute function public.stamp_place_update();