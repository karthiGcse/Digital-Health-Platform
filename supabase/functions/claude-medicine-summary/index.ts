import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { medicine_name, medicine_data } = await req.json();
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
          { role: "system", content: "You are a friendly pharmacist AI. Explain medicines in simple, easy-to-understand language. Use the summarize_medicine tool to respond." },
          { role: "user", content: `Explain this medicine in simple terms:\n\nName: ${medicine_name}\nDetails: ${JSON.stringify(medicine_data)}` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "summarize_medicine",
            description: "Return a plain-language medicine summary",
            parameters: {
              type: "object",
              properties: {
                plain_language_summary: { type: "string" },
                key_benefits: { type: "array", items: { type: "string" } },
                common_questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: { question: { type: "string" }, answer: { type: "string" } },
                    required: ["question", "answer"],
                  },
                },
              },
              required: ["plain_language_summary", "key_benefits", "common_questions"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "summarize_medicine" } },
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
    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("medicine summary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
