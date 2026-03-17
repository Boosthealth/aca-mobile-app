// @ts-ignore — resolved by Deno at runtime
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GHL_BASE_URL = "https://rest.gohighlevel.com/v1";
const ALLOWED_ENDPOINTS = ["/custom-fields", "/contacts/lookup"];
const ALLOWED_CONTACT_PATTERN = /^\/contacts\/[a-zA-Z0-9_-]+$/;

const GHL_API_TOKEN = Deno.env.get("GHL_API_TOKEN");

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

const isAllowedEndpoint = (endpoint: string): boolean =>
  ALLOWED_CONTACT_PATTERN.test(endpoint) ||
  ALLOWED_ENDPOINTS.some(
    (base) =>
      endpoint === base || endpoint.startsWith(base + "?") || endpoint.startsWith(base + "/")
  );

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  // Check variables before any other logic
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return new Response(
      JSON.stringify({ error: "Server configuration error. Please try again later." }),
      { status: 500, headers: corsHeaders }
    );
  }
  if (!GHL_API_TOKEN) {
    return new Response(JSON.stringify({ error: "GHL_API_TOKEN is not configured" }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    let endpoint: string;
    try {
      const body = await req.json();
      if (!body.endpoint || typeof body.endpoint !== "string") {
        return new Response(JSON.stringify({ error: "Missing or invalid endpoint" }), {
          status: 400,
          headers: corsHeaders,
        });
      }
      endpoint = body.endpoint;
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!isAllowedEndpoint(endpoint)) {
      return new Response(JSON.stringify({ error: "Endpoint not allowed" }), {
        status: 403,
        headers: corsHeaders,
      });
    }

    const ghlResponse = await fetch(`${GHL_BASE_URL}${endpoint}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${GHL_API_TOKEN}`,
      },
    });

    let responseBody: string;

    if (ghlResponse.status === 204) {
      responseBody = "";
    } else {
      const contentType = ghlResponse.headers.get("content-type") || "";
      if (contentType.toLowerCase().includes("application/json")) {
        try {
          const data = await ghlResponse.json();
          responseBody = JSON.stringify(data);
        } catch {
          const textBody = await ghlResponse.text();
          responseBody = JSON.stringify({ raw: textBody });
        }
      } else {
        const textBody = await ghlResponse.text();
        responseBody = JSON.stringify({ raw: textBody });
      }
    }

    return new Response(responseBody, {
      status: ghlResponse.status,
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error("Error in GHL proxy function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
