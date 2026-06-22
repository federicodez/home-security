# Admin Provisioning

The app uses existing-user OTP login:

```ts
shouldCreateUser: false
```

That means users must be approved before they can sign in. The client app does not create or update profile rows during login.

## Flow

1. An admin calls the `invite-volunteer` Edge Function.
2. The function verifies the caller's Supabase JWT.
3. The caller must have `profiles.role = 'admin'`.
4. The function invites the email through Supabase Auth.
5. The function creates or updates the matching `profiles` row.
6. The invited user can sign in with OTP.

## Deploy Function

```bash
supabase functions deploy invite-volunteer
```

Set a server-only Supabase secret key for the function:

```bash
supabase secrets set ADMIN_SECRET_KEY=...
```

Use a secret key with admin privileges for Auth user invitations. Never expose this key in the Expo app.

Set the invite redirect target. For native app testing, use the app scheme from `app.json`:

```bash
supabase secrets set INVITE_REDIRECT_URL=homesecurity://auth/callback
```

Also add this URL to Supabase Dashboard -> Authentication -> URL Configuration -> Redirect URLs.

## Example Request

```bash
curl -X POST "$SUPABASE_URL/functions/v1/invite-volunteer" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "person@example.com",
    "full_name": "Person Name",
    "role": "volunteer"
  }'
```

## Creating The First Admin

The first admin must be bootstrapped manually in Supabase because no admin exists yet to call the function.

1. Create/invite the auth user in the Supabase dashboard.
2. Copy that auth user's ID.
3. Insert or update the profile:

```sql
insert into public.profiles (
  id,
  email,
  full_name,
  role,
  available_8am,
  available_930am,
  available_11am
)
values (
  '<auth_user_id>',
  'admin@example.com',
  'Admin Name',
  'admin',
  false,
  false,
  false
)
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role;
```
