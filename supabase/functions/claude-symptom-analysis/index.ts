import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { symptoms, age, gender, duration } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a clinical symptom analysis AI assistant. Analyze patient symptoms and provide structured medical assessment. You must respond using the analyze_symptoms tool.

IMPORTANT: This is for informational purposes only. Always recommend consulting a healthcare professional.`;

    const userPrompt = `Patient Information:
- Age: ${age}
- Gender: ${gender}
- Symptoms: ${symptoms}
- Duration: ${duration}

Analyze these symptoms and provide a comprehensive assessment.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_symptoms",
              description: "Return structured symptom analysis results",
              parameters: {
                type: "object",
                properties: {
                  risk_score: { type: "number", description: "Risk score 0-100" },
                  severity: { type: "string", enum: ["mild", "moderate", "severe", "critical"] },
                  detected_symptoms: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        severity: { type: "string", enum: ["mild", "moderate", "severe"] },
                      },
                      required: ["name", "severity"],
                    },
                  },
                  possible_conditions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        probability: { type: "number" },
                        description: { type: "string" },
                      },
                      required: ["name", "probability", "description"],
                    },
                  },
                  recommended_actions: {
                    type: "array",
                    items: { type: "string" },
                  },
                  emergency_flag: { type: "boolean" },
                  follow_up_questions: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                required: ["risk_score", "severity", "detected_symptoms", "possible_conditions", "recommended_actions", "emergency_flag"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_symptoms" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
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
    console.error("symptom analysis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
