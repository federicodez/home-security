create unique index if not exists positions_station_key
  on public.positions(station);

create table if not exists public.position_preferences (
  user_id uuid not null references public.profiles(id) on delete cascade,
  station text not null references public.positions(station) on delete cascade,
  rank integer not null check (rank > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, station),
  unique (user_id, rank)
);

alter table public.position_preferences enable row level security;

create policy "Authenticated users can read position preferences"
  on public.position_preferences
  for select
  to authenticated
  using (true);

create policy "Users can create their own position preferences"
  on public.position_preferences
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own position preferences"
  on public.position_preferences
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete their own position preferences"
  on public.position_preferences
  for delete
  to authenticated
  using (user_id = auth.uid());

grant select on public.position_preferences to authenticated;
grant insert, update, delete on public.position_preferences to authenticated;
