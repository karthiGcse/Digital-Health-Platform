import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    let systemPrompt = `You are a compassionate and supportive mental health AI companion. Your role is to:

1. Listen empathetically and validate feelings
2. Provide evidence-based coping strategies (CBT, mindfulness, grounding)
3. Help users identify thought patterns and triggers
4. Suggest self-care activities and exercises
5. Encourage professional help when appropriate

IMPORTANT:
- You are NOT a therapist or counselor
- Never diagnose mental health conditions
- For crisis situations, immediately recommend emergency services (988 Suicide & Crisis Lifeline)
- Always be warm, non-judgmental, and supportive
- Use simple, clear language
- Offer practical exercises when appropriate

Keep responses concise and warm. Use emoji sparingly for warmth.`;

    if (mode === "cbt") {
      systemPrompt += "\n\nFocus on CBT (Cognitive Behavioral Therapy) techniques. Help the user identify negative thought patterns, challenge cognitive distortions, and reframe thoughts. Guide them through structured exercises.";
    } else if (mode === "mindfulness") {
      systemPrompt += "\n\nFocus on mindfulness and meditation guidance. Lead the user through breathing exercises, body scans, and grounding techniques. Be calm and gentle in your approach.";
    } else if (mode === "journaling") {
      systemPrompt += "\n\nAct as a journaling companion. Ask reflective questions, help the user explore their feelings, and provide prompts for deeper self-reflection.";
    }

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Usage limit reached." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
