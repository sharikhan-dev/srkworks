import { createClient } from "npm:@supabase/supabase-js@2.48.0";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const VAPID_PUBLIC_KEY =
  Deno.env.get("VAPID_PUBLIC_KEY") ||
  "BLJkmgWOzMD35C2LMtuobyjb9zIBr_6vp430octYlzK6Pq8i74v4QbhNw0jOKe-ZcwxHPVoM49R_jPk1r8BBQKA";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") || "";
const VAPID_SUBJECT =
  Deno.env.get("VAPID_SUBJECT") || "mailto:dev.sharikhan@gmail.com";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  try {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  } catch (e) {
    console.error("VAPID config error:", e);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);

  // Return public key for client registration
  if (req.method === "GET") {
    return Response.json({ publicKey: VAPID_PUBLIC_KEY }, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const body = await req.json().catch(() => ({}));
    const isTest = body.action === "test";
    const record = body.record || (body.type === "INSERT" ? body.record : null);

    // Fetch all registered admin device subscriptions
    const { data: subscriptions, error: subErr } = await supabase
      .from("admin_push_subscriptions")
      .select("id, endpoint, p256dh, auth");

    if (subErr) {
      return Response.json({ error: subErr.message }, { status: 500, headers: corsHeaders });
    }

    if (!subscriptions || subscriptions.length === 0) {
      if (record?.id) {
        await supabase
          .from("contact_messages")
          .update({ notification_sent_at: new Date().toISOString() })
          .eq("id", record.id);
      }
      return Response.json({ success: true, sent: 0, message: "No admin devices registered" }, { headers: corsHeaders });
    }

    // Build push notification payload
    let pushContent: string;

    if (isTest) {
      pushContent = JSON.stringify({
        title: "🔔 Admin Push Notifications Active",
        body: "Your device is connected! You will receive instant alerts for new project inquiries.",
        icon: "/favicon.png",
        badge: "/favicon.png",
        data: {
          url: "/#admin?tab=messages",
          submissionId: "test-alert",
          time: new Date().toISOString(),
        },
      });
    } else {
      if (!record || !record.name || !record.email) {
        return Response.json({ error: "Missing submission record details" }, { status: 400, headers: corsHeaders });
      }

      // Avoid duplicate notifications if already sent
      if (record.id) {
        const { data: existing } = await supabase
          .from("contact_messages")
          .select("id, notification_sent_at")
          .eq("id", record.id)
          .maybeSingle();

        if (existing?.notification_sent_at) {
          return Response.json({ success: true, message: "Already notified" }, { headers: corsHeaders });
        }
      }

      const submissionTime = record.created_at
        ? new Date(record.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      pushContent = JSON.stringify({
        title: "New Project Inquiry",
        body: `${record.name} submitted a new inquiry.\nService: ${record.project_type || "General Inquiry"} • ${record.email}`,
        icon: "/favicon.png",
        badge: "/favicon.png",
        data: {
          submissionId: record.id,
          name: record.name,
          email: record.email,
          service: record.project_type || "General Inquiry",
          time: submissionTime,
          url: `/#admin?tab=messages&messageId=${encodeURIComponent(record.id || "")}`,
        },
      });
    }

    // Dispatch Web Push to all registered admin devices
    let sentCount = 0;
    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          pushContent,
          { TTL: 86400, urgency: "high" }
        );
        sentCount++;
      } catch (err: any) {
        // Auto-cleanup expired subscriptions (HTTP 404 or 410)
        if (err.statusCode === 404 || err.statusCode === 410) {
          await supabase.from("admin_push_subscriptions").delete().eq("id", sub.id);
        }
      }
    }

    // Mark as notified in database
    if (record?.id) {
      await supabase
        .from("contact_messages")
        .update({ notification_sent_at: new Date().toISOString() })
        .eq("id", record.id);
    }

    return Response.json({ success: true, sent: sentCount, total: subscriptions.length }, { headers: corsHeaders });
  } catch (err: any) {
    return Response.json({ error: err.message || "Internal error" }, { status: 500, headers: corsHeaders });
  }
});
