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
  v_updated_count integer;
begin
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  )
  into v_is_admin;

  if not v_is_admin then
    raise exception 'Only admins can update assignments'
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
