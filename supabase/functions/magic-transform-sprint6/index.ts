import { withSupabase } from "jsr:@supabase/server@^1";

const ALLOWED_ORIGIN = "https://levelyougift.github.io";
const BUCKET = "levelyou-photos";
const MODEL = Deno.env.get("RUNWAY_IMAGE_MODEL") || "gen4_image_turbo";
const RATIO = Deno.env.get("RUNWAY_IMAGE_RATIO") || "1080:1440";
const API = "https://api.dev.runwayml.com/v1";
const API_VERSION = "2024-11-06";
const MAGIC_INDEX = 2;
const MAX_POLLS = 18;
const POLL_MS = 750;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function cors() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: cors() });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function magicState(gameData: any) {
  const mt = gameData?.magic_transform;
  return mt && typeof mt === "object" ? mt : { status: "pending", index: MAGIC_INDEX, style: "editorial_v1" };
}

async function runway(path: string, init: RequestInit = {}) {
  const secret = Deno.env.get("RUNWAYML_API_SECRET");
  if (!secret) throw new Error("RUNWAY_NOT_CONFIGURED");
  return fetch(API + path, {
    ...init,
    headers: {
      "Authorization": "Bearer " + secret,
      "X-Runway-Version": API_VERSION,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}

const PROMPT =
  "Transform @input into a premium editorial digital illustration for a personalized celebration gift. " +
  "Preserve identity, facial proportions, hairstyle, clothing colors and overall composition. " +
  "Elegant cinematic lighting, warm emotional tone, refined illustrated detail, subtle depth and polished premium finish. " +
  "Keep the person clearly recognizable. Avoid exaggerated cartoon features, anime, text, added objects, age changes or identity drift.";

export default {
  fetch: withSupabase({ auth: "none" }, async (req, ctx) => {
    if (req.method === "OPTIONS") return json({ ok: true });
    if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
    if ((req.headers.get("origin") || "") !== ALLOWED_ORIGIN) return json({ error: "Origin not allowed" }, 403);

    try {
      const body = await req.json();
      const orderId = typeof body?.orderId === "string" ? body.orderId : "";
      if (!UUID_RE.test(orderId)) return json({ error: "Invalid orderId" }, 400);

      const { data: order, error: orderError } = await ctx.supabaseAdmin
        .from("orders")
        .select("id,status,game_data")
        .eq("id", orderId)
        .single();

      if (orderError || !order) return json({ error: "Order not found" }, 404);
      if (!["draft", "checkout_created", "paid"].includes(order.status)) return json({ error: "Order not eligible" }, 409);

      const gameData = order.game_data || {};
      const current = magicState(gameData);
      if (current.status === "ready" && current.path) return json({ ok: true, status: "ready", cached: true });
      if (current.status === "processing" && current.task_id) return json({ ok: true, status: "processing", taskId: current.task_id });

      const paths = Array.isArray(gameData.photo_paths) ? gameData.photo_paths : [];
      if (paths.length !== 5 || !paths[MAGIC_INDEX]) return json({ error: "Photo not available" }, 409);

      const { data: sourceSigned, error: sourceError } = await ctx.supabaseAdmin.storage
        .from(BUCKET)
        .createSignedUrl(paths[MAGIC_INDEX], 300);
      if (sourceError || !sourceSigned?.signedUrl) return json({ error: "Could not prepare source photo" }, 500);

      const startedAt = Date.now();
      const createResponse = await runway("/text_to_image", {
        method: "POST",
        body: JSON.stringify({
          model: MODEL,
          ratio: RATIO,
          promptText: PROMPT,
          referenceImages: [{ uri: sourceSigned.signedUrl, tag: "input" }],
        }),
      });
      const created = await createResponse.json().catch(() => ({}));
      if (!createResponse.ok || !created?.id) {
        console.error("Runway create failed", createResponse.status, created);
        const failedData = {
          ...gameData,
          magic_transform: { status: "failed", index: MAGIC_INDEX, style: "editorial_v1", reason: "create_failed" },
        };
        await ctx.supabaseAdmin.from("orders").update({ game_data: failedData }).eq("id", orderId);
        return json({ ok: false, status: "fallback" });
      }

      await ctx.supabaseAdmin.from("orders").update({
        game_data: {
          ...gameData,
          magic_transform: {
            status: "processing",
            index: MAGIC_INDEX,
            style: "editorial_v1",
            task_id: created.id,
            model: MODEL,
          },
        },
      }).eq("id", orderId);

      let task: any = null;
      for (let attempt = 0; attempt < MAX_POLLS; attempt++) {
        if (attempt) await sleep(POLL_MS);
        const taskResponse = await runway("/tasks/" + encodeURIComponent(created.id), { method: "GET" });
        task = await taskResponse.json().catch(() => ({}));
        if (!taskResponse.ok) continue;
        if (task?.status === "SUCCEEDED") break;
        if (task?.status === "FAILED" || task?.status === "CANCELLED") break;
      }

      const outputUrl = task?.status === "SUCCEEDED" && Array.isArray(task?.output) ? task.output[0] : null;
      if (!outputUrl || typeof outputUrl !== "string") {
        const failedData = {
          ...gameData,
          magic_transform: {
            status: "failed",
            index: MAGIC_INDEX,
            style: "editorial_v1",
            task_id: created.id,
            model: MODEL,
            reason: task?.status || "timeout",
          },
        };
        await ctx.supabaseAdmin.from("orders").update({ game_data: failedData }).eq("id", orderId);
        return json({ ok: false, status: "fallback" });
      }

      const imageResponse = await fetch(outputUrl);
      if (!imageResponse.ok) throw new Error("RUNWAY_OUTPUT_DOWNLOAD");
      const blob = await imageResponse.blob();
      const path = orderId + "/magic-transform-3.jpg";
      const bytes = new Uint8Array(await blob.arrayBuffer());

      const { error: uploadError } = await ctx.supabaseAdmin.storage
        .from(BUCKET)
        .upload(path, bytes, { contentType: blob.type || "image/jpeg", upsert: true });
      if (uploadError) throw uploadError;

      const latencyMs = Date.now() - startedAt;
      const readyData = {
        ...gameData,
        magic_transform: {
          status: "ready",
          index: MAGIC_INDEX,
          style: "editorial_v1",
          path,
          task_id: created.id,
          model: MODEL,
          latency_ms: latencyMs,
        },
      };
      const { error: saveError } = await ctx.supabaseAdmin.from("orders").update({ game_data: readyData }).eq("id", orderId);
      if (saveError) throw saveError;

      return json({ ok: true, status: "ready", latencyMs });
    } catch (error) {
      console.error("magic-transform-sprint6", error);
      return json({ ok: false, status: "fallback" }, 200);
    }
  }),
};
