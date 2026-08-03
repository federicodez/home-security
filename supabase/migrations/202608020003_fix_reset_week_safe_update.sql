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
    available_11am = false
  where true;
end;
$$;

revoke all on function public.reset_weekly_assignments_and_availability() from public;
