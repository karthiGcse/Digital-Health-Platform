import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { location, service_type, query } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a healthcare facility locator. Generate realistic nearby healthcare facilities based on the user's location and needs. Return facilities with realistic Indian addresses, phone numbers, ratings, and operating hours." },
          { role: "user", content: `Find ${service_type || 'healthcare'} services near ${location || 'the user'}. ${query ? `Additional context: ${query}` : ''} Generate 6-8 realistic facilities.` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "list_facilities",
              description: "Return list of nearby healthcare facilities",
              parameters: {
                type: "object",
                properties: {
                  facilities: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        type: { type: "string", enum: ["hospital", "pharmacy", "clinic", "lab", "emergency"] },
                        address: { type: "string" },
                        phone: { type: "string" },
                        rating: { type: "number" },
                        distance_km: { type: "number" },
                        open_now: { type: "boolean" },
                        hours: { type: "string" },
                        specialties: { type: "array", items: { type: "string" } },
                        emergency_available: { type: "boolean" },
                      },
                      required: ["name", "type", "address", "rating", "distance_km", "open_now"],
                    },
                  },
                  recommendation: { type: "string", description: "AI recommendation based on the query" },
                },
                required: ["facilities", "recommendation"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "list_facilities" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    return new Response(JSON.stringify(JSON.parse(toolCall.function.arguments)), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("nearby-services error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
