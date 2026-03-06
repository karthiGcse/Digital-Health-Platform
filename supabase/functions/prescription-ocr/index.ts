import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prescription_text } = await req.json();
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
          { role: "system", content: "You are a medical prescription parser. Extract structured data from prescription text. Be accurate and thorough." },
          { role: "user", content: `Parse this prescription and extract structured data:\n\n${prescription_text}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "parse_prescription",
              description: "Extract structured prescription data",
              parameters: {
                type: "object",
                properties: {
                  prescribed_by: { type: "string", description: "Doctor name" },
                  clinic_name: { type: "string", description: "Clinic or hospital name" },
                  diagnosis: { type: "string", description: "Diagnosis or condition" },
                  medicines: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        dosage: { type: "string" },
                        frequency: { type: "string" },
                        duration: { type: "string" },
                        instructions: { type: "string" },
                      },
                      required: ["name", "dosage", "frequency"],
                    },
                  },
                  date: { type: "string", description: "Prescription date in YYYY-MM-DD format" },
                },
                required: ["medicines"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "parse_prescription" } },
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
    console.error("prescription-ocr error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
