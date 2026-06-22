# invite-volunteer

Admin-only Supabase Edge Function for approving a volunteer.

It:

1. Verifies the caller's JWT.
2. Requires the caller's `profiles.role` to be `admin`.
3. Invites the user through Supabase Auth.
4. Creates or updates the matching `profiles` row.

## Deploy

```bash
supabase functions deploy invite-volunteer
```

Supabase provides `SUPABASE_URL` automatically. Set a server-only Supabase secret key:

```bash
supabase secrets set ADMIN_SECRET_KEY=...
```

Use a secret key with admin privileges for Auth user invitations. Never expose this key in the Expo app.

Set the invite redirect URL:

```bash
supabase secrets set INVITE_REDIRECT_URL=homesecurity://auth/callback
```

Also add this URL to Supabase Dashboard -> Authentication -> URL Configuration -> Redirect URLs.

## Request

```bash
curl -X POST "$SUPABASE_URL/functions/v1/invite-volunteer" \
  -H "Authorization: Bearer $USER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "person@example.com",
    "full_name": "Person Name",
    "role": "volunteer"
  }'
```
