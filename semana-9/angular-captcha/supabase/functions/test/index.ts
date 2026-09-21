// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

// Función de humo: sirve para comprobar que el despliegue, la apiKey y el CORS
// funcionan, sin depender de ningún servicio externo ni de secrets.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// This endpoint uses 'publishable' | 'secret' access, apiKey is required.
// Use publishable for Client-facing, key-validated endpoints
// Use secret for Server-to-server, internal calls
export default {
  fetch: withSupabase({ auth: ["publishable", "secret"] }, async (req, _ctx) => {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // El nombre es opcional: se acepta por query string o por body JSON, y si
    // no viene ninguno se responde igual. Así un GET simple también sirve.
    let name = new URL(req.url).searchParams.get("name") ?? "";
    if (!name && req.method === "POST") {
      try {
        const body = await req.json() as { name?: unknown };
        if (typeof body.name === "string") name = body.name;
      } catch {
        // Body vacío o no-JSON: se ignora y se usa el saludo por defecto.
      }
    }

    return Response.json(
      { message: `Hello ${name || "World"}!`, timestamp: new Date().toISOString() },
      { headers: CORS_HEADERS },
    );
  }),
};

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request GET 'http://127.0.0.1:54321/functions/v1/test' \
    --header 'apiKey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/test' \
    --header 'apiKey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Javier"}'

*/
