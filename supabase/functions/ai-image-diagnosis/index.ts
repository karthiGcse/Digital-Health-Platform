import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { image_base64, analysis_type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a medical image analysis AI assistant. You help users understand potential skin conditions, eye issues, or other visible medical concerns from images. 

IMPORTANT DISCLAIMERS:
- You are NOT a doctor and cannot provide medical diagnoses
- Always recommend consulting a healthcare professional
- Provide educational information only
- Rate your confidence level honestly

Analyze the image and respond with a JSON object using this exact structure:
{
  "condition_name": "Name of the suspected condition",
  "confidence": "low" | "medium" | "high",
  "description": "Brief description of what you observe",
  "possible_conditions": ["condition1", "condition2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "urgency": "low" | "moderate" | "high" | "emergency",
  "when_to_see_doctor": "Guidance on when to seek medical attention"
}

Analysis type requested: ${analysis_type || "general"}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: "Please analyze this medical image and provide your assessment." },
              { type: "image_url", image_url: { url: image_base64 } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Usage limit reached." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { description: content, confidence: "low", recommendations: ["Consult a doctor"] };
    } catch {
      parsed = { description: content, confidence: "low", recommendations: ["Consult a doctor"] };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
