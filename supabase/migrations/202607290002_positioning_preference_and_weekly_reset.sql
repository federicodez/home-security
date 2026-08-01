alter table public.profiles
add column if not exists positioning_preference text not null default 'admin';

alter table public.profiles
drop constraint if exists profiles_positioning_preference_check;

alter table public.profiles
add constraint profiles_positioning_preference_check
check (positioning_preference in ('self', 'admin'));

drop function if exists public.get_volunteer_service_assignments();

create function public.get_volunteer_service_assignments()
returns table (
  user_id uuid,
  full_name text,
  positioning_preference text,
  services jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    p.id as user_id,
    p.full_name,
    p.positioning_preference,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'service_id', s.id,
          'service_name', s.name,
          'station', a.station
        )
        order by s.starts_at
      ) filter (where s.id is not null),
      '[]'::jsonb
    ) as services
  from public.profiles p
  cross join public.services s
  left join public.assignments a
    on a.service_id = s.id
    and a.user_id = p.id
  where coalesce(p.role, 'volunteer') = 'volunteer'
  group by p.id, p.full_name, p.positioning_preference
  order by p.full_name;
$$;

revoke all on function public.get_volunteer_service_assignments() from public;
grant execute on function public.get_volunteer_service_assignments() to authenticated;

create or replace function public.reset_weekly_assignments_and_availability()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.assignments
  set user_id = null
  where user_id is not null;

  update public.profiles
  set
    available_8am = false,
    available_930am = false,
    available_11am = false;
end;
$$;

revoke all on function public.reset_weekly_assignments_and_availability() from public;

create extension if not exists pg_cron with schema extensions;

do $$
begin
  perform cron.unschedule('weekly-reset-assignments-availability');
exception
  when others then
    null;
end;
$$;

select cron.schedule(
  'weekly-reset-assignments-availability',
  '0 5 * * 1',
  $$select public.reset_weekly_assignments_and_availability();$$
);
