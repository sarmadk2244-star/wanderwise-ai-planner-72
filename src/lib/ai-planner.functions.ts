import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  destination: z.string().min(1).max(120),
  days: z.number().min(1).max(30),
  budget: z.string().min(1).max(60),
  travelers: z.number().min(1).max(20),
  tripType: z.enum(["Family", "Friends", "Honeymoon", "Solo", "Adventure"]),
  notes: z.string().max(500).optional(),
});

export const generateTripPlan = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI gateway not configured");

    const prompt = `Create a detailed, realistic trip itinerary in Markdown.
Destination: ${data.destination}
Duration: ${data.days} days
Travelers: ${data.travelers} (${data.tripType})
Budget: ${data.budget}
${data.notes ? `Notes: ${data.notes}` : ""}

Include:
- A short intro and best season tip
- Day-by-day plan (morning / afternoon / evening) with specific places
- 3 recommended hotels at different price points
- 5 must-try local foods or restaurants
- Estimated budget breakdown (flights/transport, stay, food, activities)
- Practical travel tips
Keep it elegant, scannable, with headings and bullet points.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a world-class travel concierge specializing in South Asia, Middle East, and Southeast Asia trips. Be specific, warm, and practical." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Add funds in workspace settings.");
      throw new Error(`AI request failed (${res.status})`);
    }
    const json = await res.json();
    const content: string = json.choices?.[0]?.message?.content ?? "No plan generated.";
    return { plan: content };
  });
