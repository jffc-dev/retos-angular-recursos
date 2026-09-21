// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

// Verificación de reCAPTCHA v2 ("No soy un robot").
//
// El reto lo genera y lo resuelve el widget en el navegador. Cuando el usuario
// marca la casilla, Google le entrega un token al frontend. Esta función es el
// único paso de servidor: le pregunta a Google si ese token es legítimo.
//
//   Angular  --token-->  esta función  --token + secret-->  Google
//                                      <--- { success } ---
//
// El secret NUNCA debe viajar al navegador, por eso la llamada se hace aquí.
const SITEVERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const MAX_TOKEN_LENGTH = 2048;
const TIMEOUT_MS = 10_000;

interface SiteverifyResponse {
  success: boolean;
  hostname?: string;
  "error-codes"?: string[];
}

// Allowlist opcional de hostnames del frontend, separados por coma.
// Si queda vacía no se valida. En producción no debe incluir localhost.
function allowedHostnames(): Set<string> {
  return new Set(
    (Deno.env.get("CAPTCHA_HOSTNAMES") ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean),
  );
}

// La IP del cliente se toma del header, nunca del body: el body lo controla
// quien llama y podría falsearla.
function clientIp(req: Request): string | undefined {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || undefined;
}

async function siteverify(
  secret: string,
  token: string,
  ip: string | undefined,
): Promise<SiteverifyResponse | null> {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body,
    });
    if (!response.ok) return null;
    return await response.json() as SiteverifyResponse;
  } catch {
    // Timeout, error de red o cuerpo no-JSON: se falla cerrado.
    return null;
  }
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: CORS_HEADERS });
}

async function verify(req: Request): Promise<Response> {
  let body: { token?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ valid: false, reason: "invalid_body" }, 400);
  }

  const { token } = body;
  if (typeof token !== "string" || !token || token.length > MAX_TOKEN_LENGTH) {
    return json({ valid: false, reason: "invalid_token" }, 400);
  }

  const secret = Deno.env.get("RECAPTCHA_SECRET");
  if (!secret) {
    console.error("Falta la variable de entorno RECAPTCHA_SECRET");
    return json({ valid: false, reason: "not_configured" }, 500);
  }

  const result = await siteverify(secret, token, clientIp(req));
  if (!result) {
    return json({ valid: false, reason: "verification_unavailable" }, 502);
  }

  // Google ya invalida el token tras el primer canje: si alguien reenvía el
  // mismo token, responde con el error 'timeout-or-duplicate'.
  if (!result.success) {
    return json(
      { valid: false, reason: "rejected", errorCodes: result["error-codes"] ?? [] },
      400,
    );
  }

  const hostnames = allowedHostnames();
  if (hostnames.size > 0 && (!result.hostname || !hostnames.has(result.hostname))) {
    return json({ valid: false, reason: "hostname_mismatch" }, 403);
  }

  return json({ valid: true });
}

// This endpoint uses 'publishable' | 'secret' access, apiKey is required.
// Use publishable for Client-facing, key-validated endpoints
// Use secret for Server-to-server, internal calls
export default {
  fetch: withSupabase({ auth: ["publishable", "secret"] }, async (req, _ctx) => {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (req.method !== "POST") {
      return json({ error: "method_not_allowed" }, 405);
    }

    return await verify(req);
  }),
};

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/captcha' \
    --header 'apiKey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' \
    --header 'Content-Type: application/json' \
    --data '{"token":"<token del widget>"}'

*/
