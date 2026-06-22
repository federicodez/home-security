# Supabase RLS Audit

There are no migration or policy files checked into this repo yet, so this audit is a checklist and SQL template for reviewing the linked Supabase project.

## Tables And Functions In Use

The app currently reads/writes:

- `profiles`
- `services`
- `positions`
- `assignments`
- RPC `assign_user_to_station`
- RPC `get_volunteer_service_assignments`

## Expected Access Model

- Authenticated approved users can read service, position, assignment, and roster data needed by the app.
- Users can read their own profile.
- Users can update their own availability fields only.
- Assignment changes should be restricted to trusted roles, or enforced inside `assign_user_to_station`.
- Anonymous users should not read or mutate app data.
- RPC functions should not bypass authorization accidentally.

## RLS Status Queries

Run these in the Supabase SQL editor:

```sql
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('profiles', 'services', 'positions', 'assignments')
order by tablename;
```

Expected: `rowsecurity = true` for all app tables.

```sql
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('profiles', 'services', 'positions', 'assignments')
order by tablename, policyname;
```

Expected: policies are explicit and do not grant broad anonymous access.

```sql
select
  n.nspname as schema,
  p.proname as function_name,
  pg_get_userbyid(p.proowner) as owner,
  p.prosecdef as security_definer,
  pg_get_function_arguments(p.oid) as arguments
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in (
    'assign_user_to_station',
    'get_volunteer_service_assignments'
  )
order by p.proname;
```

If a function is `security_definer`, review the function body carefully because it can bypass caller RLS.

```sql
select
  routine_name,
  routine_definition
from information_schema.routines
where routine_schema = 'public'
  and routine_name in (
    'assign_user_to_station',
    'get_volunteer_service_assignments'
  );
```

## Policy Templates

These are templates, not migrations to run blindly.

Profiles:

```sql
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "Users can update own availability"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());
```

The update policy above limits rows, not columns. If users must not edit `role`, `email`, or `full_name`, enforce that with a restrictive RPC or trigger.

Read-only lookup tables:

```sql
create policy "Authenticated users can read services"
on public.services
for select
to authenticated
using (true);

create policy "Authenticated users can read positions"
on public.positions
for select
to authenticated
using (true);
```

Assignments:

```sql
create policy "Authenticated users can read assignments"
on public.assignments
for select
to authenticated
using (true);
```

Assignment writes should usually go through `assign_user_to_station`, where role checks can be centralized.

## Follow-Up Recommendation

Export the deployed schema and policies into migrations so future RLS changes are reviewable in git.

Suggested command:

```bash
supabase db diff --schema public --file initial_schema
```
