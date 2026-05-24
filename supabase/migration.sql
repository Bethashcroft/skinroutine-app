-- Community shared flags (anonymous, no auth required)
create table if not exists community_products (
  id uuid primary key default gen_random_uuid(),
  name_normalised text not null,
  brand_normalised text not null,
  name_display text not null,
  brand_display text not null,
  created_at timestamptz default now(),
  unique (name_normalised, brand_normalised)
);

create table if not exists community_flags (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references community_products(id) on delete cascade,
  flag_key text not null,
  vote_count integer not null default 1,
  created_at timestamptz default now(),
  unique (product_id, flag_key)
);

create index if not exists idx_community_products_lookup
  on community_products (name_normalised, brand_normalised);

create index if not exists idx_community_flags_product
  on community_flags (product_id);

alter table community_products enable row level security;
alter table community_flags enable row level security;

create policy "Anyone can read community products"
  on community_products for select using (true);
create policy "Anyone can insert community products"
  on community_products for insert with check (true);
create policy "Anyone can read community flags"
  on community_flags for select using (true);
create policy "Anyone can insert community flags"
  on community_flags for insert with check (true);
create policy "Anyone can update community flag votes"
  on community_flags for update using (true) with check (true);

create or replace function upsert_community_flags(
  p_name text,
  p_brand text,
  p_flag_keys text[]
) returns void as $$
declare
  v_product_id uuid;
  v_name_norm text := lower(trim(p_name));
  v_brand_norm text := lower(trim(p_brand));
  v_flag text;
begin
  insert into community_products (name_normalised, brand_normalised, name_display, brand_display)
  values (v_name_norm, v_brand_norm, p_name, p_brand)
  on conflict (name_normalised, brand_normalised) do update
    set name_display = excluded.name_display
  returning id into v_product_id;

  foreach v_flag in array p_flag_keys loop
    insert into community_flags (product_id, flag_key, vote_count)
    values (v_product_id, v_flag, 1)
    on conflict (product_id, flag_key) do update
      set vote_count = community_flags.vote_count + 1;
  end loop;
end;
$$ language plpgsql security definer;

-- User data tables 

create table if not exists user_products (
  id text not null,
  user_id uuid not null default auth.uid(),
  name text not null,
  brand text not null,
  category text not null default 'other',
  flags jsonb not null default '[]',
  ingredients text,
  notes text,
  opened_at text,
  pao_months integer,
  created_at text not null,
  synced_at timestamptz default now(),
  primary key (user_id, id)
);

create table if not exists user_entries (
  id text not null,
  user_id uuid not null default auth.uid(),
  date text not null,
  session text not null,
  product_ids jsonb not null default '[]',
  skin_rating integer not null,
  notes text not null default '',
  synced_at timestamptz default now(),
  primary key (user_id, id)
);

create index if not exists idx_user_products_user on user_products (user_id);
create index if not exists idx_user_entries_user on user_entries (user_id);
create index if not exists idx_user_entries_date on user_entries (user_id, date);

alter table user_products enable row level security;
alter table user_entries enable row level security;

-- Users can only access their own data
create policy "Users read own products"
  on user_products for select using (auth.uid() = user_id);
create policy "Users insert own products"
  on user_products for insert with check (auth.uid() = user_id);
create policy "Users update own products"
  on user_products for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users delete own products"
  on user_products for delete using (auth.uid() = user_id);

create policy "Users read own entries"
  on user_entries for select using (auth.uid() = user_id);
create policy "Users insert own entries"
  on user_entries for insert with check (auth.uid() = user_id);
create policy "Users update own entries"
  on user_entries for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users delete own entries"
  on user_entries for delete using (auth.uid() = user_id);

create table if not exists user_skin_profiles (
  user_id uuid primary key default auth.uid(),
  skin_type text not null,
  concerns jsonb not null default '[]',
  synced_at timestamptz default now()
);

alter table user_skin_profiles enable row level security;

create policy "Users read own skin profile"
  on user_skin_profiles for select using (auth.uid() = user_id);
create policy "Users insert own skin profile"
  on user_skin_profiles for insert with check (auth.uid() = user_id);
create policy "Users update own skin profile"
  on user_skin_profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users delete own skin profile"
  on user_skin_profiles for delete using (auth.uid() = user_id);
