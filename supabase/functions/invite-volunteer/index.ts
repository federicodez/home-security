import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type InviteVolunteerRequest = {
  email?: string;
  full_name?: string;
  role?: string;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const secretKey = Deno.env.get("ADMIN_SECRET_KEY");
  const inviteRedirectUrl = Deno.env.get("INVITE_REDIRECT_URL");
  const authHeader = request.headers.get("Authorization");

  if (!supabaseUrl || !secretKey) {
    return jsonResponse({ error: "Function is missing Supabase secrets" }, 500);
  }

  if (!authHeader) {
    return jsonResponse({ error: "Missing authorization header" }, 401);
  }

  const admin = createClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user: caller },
    error: callerError,
  } = await admin.auth.getUser(token);

  if (callerError || !caller) {
    return jsonResponse({ error: "Invalid authorization token" }, 401);
  }

  const { data: callerProfile, error: callerProfileError } = await admin
    .from("profiles")
    .select("role")
    .eq("id", caller.id)
    .maybeSingle();

  if (callerProfileError) {
    return jsonResponse({ error: callerProfileError.message }, 500);
  }

  if (callerProfile?.role !== "admin") {
    return jsonResponse({ error: "Admin role required" }, 403);
  }

  let body: InviteVolunteerRequest;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const email = body.email?.trim().toLowerCase();
  const fullName = body.full_name?.trim();
  const role = body.role?.trim() || "volunteer";

  if (!email) {
    return jsonResponse({ error: "Email is required" }, 400);
  }

  if (!fullName) {
    return jsonResponse({ error: "Full name is required" }, 400);
  }

  if (!["admin", "volunteer"].includes(role)) {
    return jsonResponse({ error: "Role must be admin or volunteer" }, 400);
  }

  const { data: inviteData, error: inviteError } =
    await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: inviteRedirectUrl,
      data: {
        full_name: fullName,
      },
    });

  if (inviteError || !inviteData.user) {
    return jsonResponse(
      { error: inviteError?.message ?? "Failed to invite user" },
      400,
    );
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .upsert(
      {
        id: inviteData.user.id,
        email,
        full_name: fullName,
        role,
        available_8am: false,
        available_930am: false,
        available_11am: false,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (profileError) {
    return jsonResponse({ error: profileError.message }, 500);
  }

  return jsonResponse({ profile }, 200);
});

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
