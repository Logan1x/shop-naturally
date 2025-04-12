import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Extract search parameters using OpenAI function calling
export async function extractSearchParameters(message: string) {
  const tools = [
    {
      type: "function",
      function: {
        name: "search_phones",
        description:
          "Extracts search parameters from a natural language query.",
        parameters: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description:
                "Phone model name (e.g., 'Redmi A4 5G', 'Galaxy S23').",
            },
            price_min: {
              type: "number",
              description: "Minimum phone price. it is around 2000",
            },
            price_max: { type: "number", description: "Maximum phone price." },
            ram: { type: "number", description: "RAM in GB (e.g., 6, 8)." },
            storage: {
              type: "number",
              description: "Storage in GB (e.g., 128, 256).",
            },
            brand: {
              type: "string",
              description: "Phone brand (e.g., 'Xiaomi', 'Samsung').",
            },
            rating_min: {
              type: "number",
              description: "Minimum rating (e.g., 4, 4.5).",
            },
            isInStock: {
              type: "boolean",
              description: "Whether the phone is in stock.",
            },
            popularity_min: {
              type: "number",
              description: "Minimum popularity threshold (e.g., 1000 for 1K+).",
            },
            reviews_min: {
              type: "number",
              description: "Minimum number of reviews.",
            },
            search_term: {
              type: "string",
              description:
                "General search term to match against the full name of the phone.",
            },
            has_feature: {
              type: "string",
              description:
                "Specific feature the phone should have (e.g., '5G', 'fast charging', '120Hz').",
            },
            camera_quality: {
              type: "string",
              description:
                "Camera specification (e.g., '50MP', 'dual camera').",
            },
            sort_by: {
              type: "string",
              enum: [
                "price_asc",
                "price_desc",
                "rating",
                "popularity",
                "newest",
              ],
              description: "Sort order for results.",
            },
          },
          required: [],
        },
      },
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Extract structured search parameters for phone queries. Correct the brand name if user made a typo.",
      },
      { role: "user", content: message },
    ],
    tools: tools as any,
    tool_choice: "auto",
  });

  const toolCalls = response.choices[0]?.message?.tool_calls;
  if (toolCalls) {
    for (const toolCall of toolCalls) {
      if (toolCall.function.name === "search_phones") {
        try {
          return JSON.parse(toolCall.function.arguments);
        } catch (error) {
          console.error("Error parsing search parameters:", error);
          return {};
        }
      }
    }
  }
  return {};
}
