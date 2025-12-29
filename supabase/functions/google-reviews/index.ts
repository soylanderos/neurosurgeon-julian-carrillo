/// <reference lib="deno.ns" />

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type GoogleReview = {
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: { text?: string; languageCode?: string };
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  publishTime?: string;
  googleMapsUri?: string;
};

type GooglePlaceResponse = {
  rating?: number;
  userRatingCount?: number;
  displayName?: { text?: string; languageCode?: string };
  reviews?: GoogleReview[];
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // prod: pon tu dominio
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-site-key",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function unauthorized(msg = "Unauthorized") {
  return json({ error: msg }, 401);
}

function normalize(place: GooglePlaceResponse) {
  return {
    name: place.displayName?.text ?? null,
    rating: place.rating ?? null,
    userRatingCount: place.userRatingCount ?? null,
    reviews: (place.reviews ?? []).map((r) => ({
      author: r.authorAttribution?.displayName ?? "Anónimo",
      authorUrl: r.authorAttribution?.uri ?? null,
      authorPhoto: r.authorAttribution?.photoUri ?? null,
      rating: r.rating ?? null,
      relativeTime: r.relativePublishTimeDescription ?? null,
      publishTime: r.publishTime ?? null,
      text: r.text?.text ?? "",
      googleMapsUri: r.googleMapsUri ?? null,
    })),
  };
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET") return json({ error: "Method not allowed" }, 405);

  // 🔐 Protección simple para que no te usen la función como proxy
  const siteKey = Deno.env.get("SITE_KEY");
  const reqKey = req.headers.get("x-site-key");

  if (!siteKey || reqKey !== siteKey) {
    return json({ error: "Missing or invalid site key" }, 401);
  }


  const GOOGLE_PLACES_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");
  const DEFAULT_PLACE_ID = Deno.env.get("GOOGLE_PLACE_ID");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!GOOGLE_PLACES_API_KEY || !DEFAULT_PLACE_ID) {
    return json({ error: "Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID" }, 500);
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json({ error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" }, 500);
  }

  const url = new URL(req.url);
  const languageCode = url.searchParams.get("lang") ?? "es";
  const maxReviews = Math.max(0, Number(url.searchParams.get("max") ?? "12"));
  const ttlHours = Math.max(1, Number(url.searchParams.get("ttlHours") ?? "12"));

  // ✅ Recomendación: NO aceptar placeId arbitrario en público (evitas abuso)
  // Si quieres permitirlo, descomenta la línea de abajo y comenta la asignación fija.
  // const placeId = url.searchParams.get("placeId") ?? DEFAULT_PLACE_ID;
  const placeId = DEFAULT_PLACE_ID;

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // 1) Cache
  const { data: cached, error: cacheErr } = await supabase
    .from("google_reviews_cache")
    .select("data,fetched_at")
    .eq("place_id", placeId)
    .eq("language_code", languageCode)
    .maybeSingle();

  if (cacheErr) console.warn("Cache read error", cacheErr);

  if (cached?.data && cached.fetched_at) {
    const fetchedAt = new Date(cached.fetched_at).getTime();
    const ttlMs = ttlHours * 60 * 60 * 1000;
    if (Date.now() - fetchedAt < ttlMs) {
      const normalized = cached.data as any;
      if (normalized?.reviews?.length) normalized.reviews = normalized.reviews.slice(0, maxReviews);
      return json({ source: "cache", ...normalized });
    }
  }

  // 2) Google Places Details v1
  const googleUrl =
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=${encodeURIComponent(languageCode)}`;

  const googleRes = await fetch(googleUrl, {
    headers: {
      "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
      "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews",
    },
  });

  if (!googleRes.ok) {
    const body = await googleRes.text().catch(() => "");
    return json({ error: "Google Places error", status: googleRes.status, body }, 502);
  }

  const place = (await googleRes.json()) as GooglePlaceResponse;
  const normalized = normalize(place);
  normalized.reviews = normalized.reviews.slice(0, maxReviews);

  // 3) Cache upsert (OJO: conflict compuesto)
  const { error: upsertErr } = await supabase
    .from("google_reviews_cache")
    .upsert(
      {
        place_id: placeId,
        language_code: languageCode,
        data: normalized,
        fetched_at: new Date().toISOString(),
      },
      { onConflict: "place_id,language_code" }
    );

  if (upsertErr) console.warn("Cache upsert error", upsertErr);

  return json({ source: "google", ...normalized });
});
