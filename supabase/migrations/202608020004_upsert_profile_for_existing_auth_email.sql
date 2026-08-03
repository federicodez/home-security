create or replace function public.admin_upsert_profile_for_auth_email(
  p_email text,
  p_full_name text,
  p_role text default 'volunteer'
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
  v_full_name text := trim(p_full_name);
  v_role text := coalesce(nullif(trim(p_role), ''), 'volunteer');
  v_user_id uuid;
  v_profile public.profiles;
begin
  if v_email = '' then
    raise exception 'Email is required' using errcode = '23514';
  end if;

  if v_full_name = '' then
    raise exception 'Full name is required' using errcode = '23514';
  end if;

  if v_role not in ('admin', 'volunteer') then
    raise exception 'Role must be admin or volunteer' using errcode = '23514';
  end if;

  select id
  into v_user_id
  from auth.users
  where lower(email) = v_email
  limit 1;

  if v_user_id is null then
    raise exception 'Auth user not found for email %', v_email
      using errcode = 'P0002';
  end if;

  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    available_8am,
    available_930am,
    available_11am,
    can_serve
  )
  values (
    v_user_id,
    v_email,
    v_full_name,
    v_role,
    false,
    false,
    false,
    true
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role,
    can_serve = true
  returning * into v_profile;

  return v_profile;
end;
$$;

revoke all on function public.admin_upsert_profile_for_auth_email(text, text, text) from public;
grant execute on function public.admin_upsert_profile_for_auth_email(text, text, text) to service_role;
