alter table public.profiles
add column if not exists can_serve boolean not null default true;

drop function if exists public.get_volunteer_service_assignments();

create function public.get_volunteer_service_assignments()
returns table (
  user_id uuid,
  full_name text,
  services jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    p.id as user_id,
    p.full_name,
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
  where p.can_serve = true
  group by p.id, p.full_name
  order by p.full_name;
$$;

revoke all on function public.get_volunteer_service_assignments() from public;
grant execute on function public.get_volunteer_service_assignments() to authenticated;
