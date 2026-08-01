create or replace function public.assign_user_to_station(
  p_user uuid,
  p_service uuid,
  p_station text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_admin boolean;
  v_current_user uuid := auth.uid();
  v_updated_count integer;
begin
  select exists (
    select 1
    from public.profiles
    where id = v_current_user
      and role = 'admin'
  )
  into v_is_admin;

  if v_current_user is null then
    raise exception 'Authentication required'
      using errcode = '42501';
  end if;

  if p_user is not null then
    if not exists (
      select 1
      from public.profiles
      where id = p_user
    ) then
      raise exception 'Profile % does not exist', p_user
        using errcode = '23503';
    end if;
  end if;

  if not v_is_admin then
    if p_user is null then
      update public.assignments
      set user_id = null
      where service_id = p_service
        and station = p_station
        and user_id = v_current_user;

      get diagnostics v_updated_count = row_count;

      if v_updated_count = 0 then
        raise exception 'Volunteers can only clear their own assignment'
          using errcode = '42501';
      end if;

      return;
    end if;

    if p_user <> v_current_user then
      raise exception 'Volunteers can only assign themselves'
        using errcode = '42501';
    end if;

    if exists (
      select 1
      from public.assignments
      where service_id = p_service
        and station = p_station
        and user_id is not null
        and user_id <> v_current_user
    ) then
      raise exception 'Station is already assigned'
        using errcode = '23505';
    end if;
  end if;

  if p_user is not null then
    update public.assignments
    set user_id = null
    where service_id = p_service
      and user_id = p_user;
  end if;

  update public.assignments
  set user_id = p_user
  where service_id = p_service
    and station = p_station;

  get diagnostics v_updated_count = row_count;

  if v_updated_count = 0 then
    insert into public.assignments (service_id, station, user_id)
    values (p_service, p_station, p_user);
  end if;
end;
$$;

revoke all on function public.assign_user_to_station(uuid, uuid, text) from public;
grant execute on function public.assign_user_to_station(uuid, uuid, text) to authenticated;
