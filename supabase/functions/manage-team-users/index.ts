// Admin-only edge function to provision team users (admin/sdr) and manage their roles.
// Requires the caller to have the 'admin' role in user_roles.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Action =
  | { action: "list" }
  | { action: "invite"; email: string; password: string; role: "admin" | "sdr" }
  | { action: "set_role"; user_id: string; role: "admin" | "sdr" }
  | { action: "remove_role"; user_id: string; role: "admin" | "sdr" }
  | { action: "delete_user"; user_id: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return json({ error: "Missing auth" }, 401);
    }

    // Verify caller is admin
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return json({ error: "Invalid session" }, 401);
    }
    const callerId = userData.user.id;

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: isAdmin, error: roleErr } = await admin.rpc("has_role", {
      _user_id: callerId,
      _role: "admin",
    });
    if (roleErr || !isAdmin) {
      return json({ error: "Forbidden — admin only" }, 403);
    }

    const body = (await req.json()) as Action;

    switch (body.action) {
      case "list": {
        const { data: users, error: listErr } = await admin.auth.admin.listUsers({
          page: 1,
          perPage: 200,
        });
        if (listErr) throw listErr;

        const ids = users.users.map((u) => u.id);
        const { data: roles, error: rolesErr } = await admin
          .from("user_roles")
          .select("user_id, role")
          .in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
        if (rolesErr) throw rolesErr;

        const rolesByUser: Record<string, string[]> = {};
        (roles || []).forEach((r) => {
          rolesByUser[r.user_id] = [...(rolesByUser[r.user_id] || []), r.role];
        });

        const result = users.users
          .map((u) => ({
            id: u.id,
            email: u.email,
            created_at: u.created_at,
            last_sign_in_at: u.last_sign_in_at,
            roles: rolesByUser[u.id] || [],
          }))
          .filter((u) => u.roles.includes("admin") || u.roles.includes("sdr"));

        return json({ users: result });
      }

      case "invite": {
        if (!body.email || !body.password || !body.role) {
          return json({ error: "email, password, and role are required" }, 400);
        }
        if (body.password.length < 12) {
          return json({ error: "Password must be at least 12 characters" }, 400);
        }

        // Create the user with email already confirmed
        const { data: created, error: createErr } = await admin.auth.admin.createUser({
          email: body.email.trim().toLowerCase(),
          password: body.password,
          email_confirm: true,
        });
        if (createErr) {
          return json({ error: createErr.message }, 400);
        }
        const newId = created.user!.id;

        const { error: roleInsertErr } = await admin
          .from("user_roles")
          .insert({ user_id: newId, role: body.role });
        if (roleInsertErr) {
          // cleanup
          await admin.auth.admin.deleteUser(newId);
          return json({ error: roleInsertErr.message }, 400);
        }

        return json({ user_id: newId });
      }

      case "set_role": {
        const { error } = await admin
          .from("user_roles")
          .insert({ user_id: body.user_id, role: body.role });
        // ignore unique-violation (already has role)
        if (error && !error.message.includes("duplicate")) {
          return json({ error: error.message }, 400);
        }
        return json({ ok: true });
      }

      case "remove_role": {
        // Prevent admin removing their own admin role (would lock them out)
        if (body.user_id === callerId && body.role === "admin") {
          return json({ error: "Cannot remove your own admin role" }, 400);
        }
        const { error } = await admin
          .from("user_roles")
          .delete()
          .eq("user_id", body.user_id)
          .eq("role", body.role);
        if (error) return json({ error: error.message }, 400);
        return json({ ok: true });
      }

      case "delete_user": {
        if (body.user_id === callerId) {
          return json({ error: "Cannot delete your own account" }, 400);
        }
        const { error } = await admin.auth.admin.deleteUser(body.user_id);
        if (error) return json({ error: error.message }, 400);
        return json({ ok: true });
      }

      default:
        return json({ error: "Unknown action" }, 400);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return json({ error: msg }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
