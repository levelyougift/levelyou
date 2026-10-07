import { withSupabase } from "jsr:@supabase/server@^1";

const ORIGIN = "https://levelyougift.github.io";
const BUCKET = "levelyou-photos";
const RUNWAY_API = "https://api.dev.runwayml.com/v1";
const RUNWAY_VERSION = "2024-11-06";
const MODEL = "gemini_image3_pro";
const MAGIC_INDEX = 2;
const MAGIC_STYLE = "editorial_v1";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const PROMPT = `Transform @input into a premium editorial digital illustration for a personalized celebration gift. Preserve the person's identity, facial proportions, hairstyle, age, clothing colors and emotional expression. Keep the original composition recognizable. Elegant cinematic lighting, warm emotional tone, refined painterly detail, subtle depth and a polished premium finish. Avoid exaggerated cartoon features, avoid anime, avoid changing identity, avoid adding text, logos or extra people.`;

function headers() {
  return {
    "Access-Control-Allow-Origin": ORIGIN,
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  };
}
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: headers() });
}
function isAllowedStatus(status: string) {
  return ["draft", "checkout_created", "paid"].includes(status);
}
function nowIso() { return new Date().toISOString(); }

async function saveMagic(ctx: any, orderId: string, gameData: any, magic: any) {
  const next = { ...(gameData || {}), magic_transform: magic };
  const { error } = await ctx.supabaseAdmin.from("orders").update({ game_data: next }).eq("id", orderId);
  if (error) throw error;
  return next;
}

async function getOrder(ctx: any, orderId: string) {
  const { data, error } = await ctx.supabaseAdmin
    .from("orders")
    .select("id,status,game_data")
    .eq("id", orderId)
    .single();
  if (error || !data) return null;
  return data;
}

async function startTask(ctx: any, order: any, secret: string) {
  const g = order.game_data || {};
  const existing = g.magic_transform || {};
  if (existing.status === "ready") return existing;
  if (existing.status === "running" && existing.task_id) return existing;

  const retries = Math.max(0, Number(existing.retry_count) || 0);
  if (existing.status === "failed" && retries >= 1) {
    return { ...existing, fallback: true };
  }

  const paths = Array.isArray(g.photo_paths) ? g.photo_paths : [];
  const sourcePath = paths[MAGIC_INDEX];
  if (!sourcePath) throw new Error("SOURCE_PHOTO_MISSING");

  const { data: signed, error: signedError } = await ctx.supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(sourcePath, 900);
  if (signedError || !signed?.signedUrl) throw new Error("SOURCE_SIGN_FAILED");

  const startedAt = Date.now();
  const response = await fetch(RUNWAY_API + "/text_to_image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + secret,
      "X-Runway-Version": RUNWAY_VERSION,
    },
    body: JSON.stringify({
      model: MODEL,
      ratio: "3:4",
      promptText: PROMPT,
      referenceImages: [{ uri: signed.signedUrl, tag: "input" }],
    }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body?.id) {
    console.error("Runway start failed", response.status, body?.error || body);
    const failed = {
      status: "failed",
      index: MAGIC_INDEX,
      style: MAGIC_STYLE,
      provider: "runway",
      model: MODEL,
      retry_count: retries + 1,
      failed_at: nowIso(),
      fallback: true,
    };
    await saveMagic(ctx, order.id, g, failed);
    return failed;
  }

  const running = {
    status: "running",
    index: MAGIC_INDEX,
    style: MAGIC_STYLE,
    provider: "runway",
    model: MODEL,
    task_id: body.id,
    retry_count: retries,
    started_at: nowIso(),
    started_ms: startedAt,
  };
  await saveMagic(ctx, order.id, g, running);
  return running;
}

async function finishTask(ctx: any, order: any, secret: string) {
  const g = order.game_data || {};
  const magic = g.magic_transform || {};
  if (magic.status !== "running" || !magic.task_id) return magic;

  const response = await fetch(RUNWAY_API + "/tasks/" + encodeURIComponent(magic.task_id), {
    headers: {
      "Authorization": "Bearer " + secret,
      "X-Runway-Version": RUNWAY_VERSION,
    },
  });
  const task = await response.json().catch(() => ({}));
  if (!response.ok) return magic;

  if (task.status === "PENDING" || task.status === "RUNNING" || task.status === "THROTTLED") {
    return magic;
  }

  if (task.status !== "SUCCEEDED" || !Array.isArray(task.output) || !task.output[0]) {
    const retries = Math.max(0, Number(magic.retry_count) || 0);
    const failed = {
      ...magic,
      status: "failed",
      retry_count: retries + 1,
      failed_at: nowIso(),
      fallback: true,
      task_error: typeof task.failure === "string" ? task.failure.slice(0, 300) : undefined,
    };
    await saveMagic(ctx, order.id, g, failed);
    return failed;
  }

  const outputUrl = task.output[0];
  const media = await fetch(outputUrl);
  if (!media.ok) throw new Error("OUTPUT_FETCH_FAILED");
  const blob = await media.blob();
  const path = order.id + "/magic-transform-3.png";

  const { error: uploadError } = await ctx.supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: blob.type || "image/png", upsert: true });
  if (uploadError) throw uploadError;

  const ready = {
    status: "ready",
    index: MAGIC_INDEX,
    style: MAGIC_STYLE,
    provider: "runway",
    model: MODEL,
    task_id: magic.task_id,
    path,
    retry_count: Number(magic.retry_count) || 0,
    latency_ms: magic.started_ms ? Math.max(0, Date.now() - Number(magic.started_ms)) : null,
    ready_at: nowIso(),
  };
  await saveMagic(ctx, order.id, g, ready);
  return ready;
}

export default {
  fetch: withSupabase({ auth: "none" }, async (req, ctx) => {
    if (req.method === "OPTIONS") return json({ ok: true });
    const origin = req.headers.get("origin") || "";
    if (origin && origin !== ORIGIN) return json({ error: "Origin not allowed" }, 403);

    const secret = Deno.env.get("RUNWAYML_API_SECRET");
    if (!secret) return json({ error: "AI transform not configured", configured: false }, 503);

    try {
      if (req.method === "POST") {
        const body = await req.json().catch(() => ({}));
        const orderId = typeof body?.orderId === "string" ? body.orderId : "";
        if (!UUID_RE.test(orderId)) return json({ error: "Invalid orderId" }, 400);

        const order = await getOrder(ctx, orderId);
        if (!order || !isAllowedStatus(order.status)) return json({ error: "Order not found" }, 404);
        const magic = await startTask(ctx, order, secret);
        return json({ ok: true, magic });
      }

      if (req.method === "GET") {
        const orderId = new URL(req.url).searchParams.get("orderId") || "";
        if (!UUID_RE.test(orderId)) return json({ error: "Invalid orderId" }, 400);

        const order = await getOrder(ctx, orderId);
        if (!order || !isAllowedStatus(order.status)) return json({ error: "Order not found" }, 404);

        let magic = order.game_data?.magic_transform || null;
        if (magic?.status === "running") magic = await finishTask(ctx, order, secret);

        if (magic?.status === "failed" && (Number(magic.retry_count) || 0) < 1) {
          const fresh = await getOrder(ctx, orderId);
          if (fresh) magic = await startTask(ctx, fresh, secret);
        }

        return json({ ok: true, magic: magic || { status: "not_started", index: MAGIC_INDEX } });
      }

      return json({ error: "Method not allowed" }, 405);
    } catch (error) {
      console.error("magic-transform-sprint6", error);
      return json({ error: "Magic transform unavailable", fallback: true }, 500);
    }
  }),
};
