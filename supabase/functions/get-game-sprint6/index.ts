import { withSupabase } from "jsr:@supabase/server@^1";

const ALLOWED_ORIGIN = "https://levelyougift.github.io";
const BUCKET = "levelyou-photos";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_VIDEO_MEMORIES = 10;

function headers() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: headers() });
}

function safeFraming(raw: any) {
  return {
    zoom: Math.max(1, Math.min(2.5, Number(raw?.zoom) || 1)),
    x: Math.max(-1, Math.min(1, Number(raw?.x) || 0)),
    y: Math.max(-1, Math.min(1, Number(raw?.y) || 0)),
  };
}

async function confirmPaymentIfNeeded(ctx: any, order: any) {
  if (order.status === "paid") return { paid: true, order };

  const sessionId = typeof order.stripe_session_id === "string" ? order.stripe_session_id : "";
  const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!sessionId || !stripeSecretKey) return { paid: false, order };

  try {
    const response = await fetch(
      "https://api.stripe.com/v1/checkout/sessions/" + encodeURIComponent(sessionId),
      { headers: { Authorization: "Bearer " + stripeSecretKey } },
    );
    const session = await response.json().catch(() => ({}));
    if (!response.ok || !session?.id || session.payment_status !== "paid") return { paid: false, order };

    const customerEmail = session?.customer_details?.email || session?.customer_email || null;
    const { data: updated, error } = await ctx.supabaseAdmin
      .from("orders")
      .update({
        status: "paid",
        customer_email: customerEmail,
        stripe_session_id: session.id,
      })
      .eq("id", order.id)
      .select("id,status,person_name,age,language,game_data,stripe_session_id")
      .single();

    if (error || !updated) {
      console.error("get-game-sprint6 payment fallback update error", error);
      return { paid: false, order };
    }
    return { paid: true, order: updated };
  } catch (error) {
    console.error("get-game-sprint6 Stripe fallback error", error);
    return { paid: false, order };
  }
}

export default {
  fetch: withSupabase({ auth: "none" }, async (req, ctx) => {
    if (req.method === "OPTIONS") return json({ ok: true });
    if (req.method !== "GET") return json({ error: "Method not allowed" }, 405);

    try {
      const token = new URL(req.url).searchParams.get("token") || "";
      if (!UUID_RE.test(token)) return json({ error: "Invalid token" }, 400);

      const { data: found, error } = await ctx.supabaseAdmin
        .from("orders")
        .select("id,status,person_name,age,language,game_data,stripe_session_id")
        .eq("share_token", token)
        .single();

      if (error || !found) return json({ error: "LevelYou not found" }, 404);

      const confirmed = await confirmPaymentIfNeeded(ctx, found);
      const order = confirmed.order;
      if (!confirmed.paid) return json({ error: "LevelYou not ready", retryable: true }, 403);

      const g = order.game_data || {};
      const paths = Array.isArray(g.photo_paths) ? g.photo_paths : [];
      const questions = Array.isArray(g.questions) ? g.questions : [];
      const memories = Array.isArray(g.memories) ? g.memories : [];
      const videoPaths = Array.isArray(g.video_photo_paths) ? g.video_photo_paths.slice(0, MAX_VIDEO_MEMORIES) : [];
      const videoMeta = Array.isArray(g.video_memories) ? g.video_memories.slice(0, MAX_VIDEO_MEMORIES) : [];

      if (paths.length !== 5 || questions.length !== 5) return json({ error: "LevelYou data incomplete" }, 500);

      const { data: signed, error: signedError } = await ctx.supabaseAdmin.storage
        .from(BUCKET)
        .createSignedUrls(paths, 3600);

      if (signedError || !signed || signed.length !== paths.length) {
        return json({ error: "Could not load photos" }, 500);
      }

      const items = questions.map((q: any, i: number) => ({
        photoUrl: signed[i]?.signedUrl || null,
        context: memories[i]?.context || "",
        framing: safeFraming(memories[i]?.framing),
        question: q?.question || "",
        answers: Array.isArray(q?.answers) ? q.answers.slice(0, 3) : [],
        correct: Number.isInteger(q?.correct) ? q.correct : Number(q?.correct || 0),
      }));

      let videoMemories: any[] = [];
      if (videoPaths.length) {
        const { data: videoSigned, error: videoSignedError } = await ctx.supabaseAdmin.storage
          .from(BUCKET)
          .createSignedUrls(videoPaths, 3600);

        if (!videoSignedError && videoSigned && videoSigned.length === videoPaths.length) {
          videoMemories = videoPaths.map((_: string, i: number) => ({
            photoUrl: videoSigned[i]?.signedUrl || null,
            order: Number.isInteger(Number(videoMeta[i]?.order)) ? Number(videoMeta[i].order) : i,
            framing: safeFraming(videoMeta[i]?.framing),
          }))
          .filter((m: any) => Boolean(m.photoUrl))
          .sort((a: any, b: any) => a.order - b.order)
          .map((m: any, i: number) => ({ ...m, order: i }));
        } else {
          console.error("Extra video memories unavailable", videoSignedError);
        }
      }

      const occasion = ["classic","birthday"].includes(g.occasion) ? g.occasion : "classic";
      return json({
        personName: order.person_name || "",
        age: order.age,
        language: order.language || "es",
        occasion,
        theme: occasion,
        dedication: typeof g.dedication === "string" ? g.dedication.slice(0, 180) : "",
        items,
        videoMemories,
      });
    } catch (error) {
      console.error("get-game-sprint6", error);
      return json({ error: "Unable to load LevelYou" }, 500);
    }
  }),
};