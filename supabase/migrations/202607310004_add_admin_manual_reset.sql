create or replace function public.admin_reset_assignments_and_availability()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  ) then
    raise exception 'Only admins can reset assignments and availability'
      using errcode = '42501';
  end if;

  perform public.reset_weekly_assignments_and_availability();
end;
$$;

revoke all on function public.admin_reset_assignments_and_availability() from public;
grant execute on function public.admin_reset_assignments_and_availability() to authenticated;
