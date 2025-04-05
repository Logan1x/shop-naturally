import { NextResponse } from "next/server";
import OpenAI from "openai";
import Phone from "@/lib/models/phone";
import Conversations from "@/lib/models/conversations";
import connectDB from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Extract search parameters using OpenAI function calling
async function extractSearchParameters(message: string) {
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
            ram: { type: "string", description: "RAM (e.g., '6GB', '8GB')." },
            storage: {
              type: "string",
              description: "Storage (e.g., '128GB', '256GB').",
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
              type: "string",
              description: "Minimum popularity threshold (e.g., '1K+', '5K+').",
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

// Search phones based on extracted filters
async function searchPhones(filters: any) {
  const match: any = {};

  // Basic filters
  if (filters.price_min)
    match.price = { ...match.price, $gte: filters.price_min };
  if (filters.price_max)
    match.price = { ...match.price, $lte: filters.price_max };
  if (filters.ram) match.ram = { $regex: new RegExp(filters.ram, "i") };
  if (filters.storage)
    match.storage = { $regex: new RegExp(filters.storage, "i") };
  if (filters.brand) match.brand = { $regex: new RegExp(filters.brand, "i") };
  if (filters.rating_min)
    match.ratingFloat = { ...match.ratingFloat, $gte: filters.rating_min };
  if (filters.isInStock !== undefined) match.isInStock = filters.isInStock;

  // New filters
  if (filters.name) match.name = { $regex: new RegExp(filters.name, "i") };
  if (filters.reviews_min) match.reviews = { $gte: filters.reviews_min };

  // Text search in fullName
  if (filters.search_term || filters.has_feature || filters.camera_quality) {
    const regexTerms = [];
    if (filters.search_term) regexTerms.push(filters.search_term);
    if (filters.has_feature) regexTerms.push(filters.has_feature);
    if (filters.camera_quality) regexTerms.push(filters.camera_quality);

    match.fullName = {
      $regex: new RegExp(regexTerms.join("|"), "i"),
    };
  }

  // Popularity filter (handling "K+" format)
  match.bought = { $ne: "N/A" };
  if (filters.popularity_min) {
    const popularityNum = parseInt(
      filters.popularity_min.replace(/K\+/i, "000").replace(/\+/, "")
    );
    if (!isNaN(popularityNum)) {
      // This is a simplification - may need adjustment based on exact format
      match.bought = {
        $regex: new RegExp(
          `(${popularityNum}\\+|\\d*[${popularityNum}-9]K\\+)`,
          "i"
        ),
      };
    }
  }

  const priceMax = filters.price_max || 20000; // fallback in case not provided

  try {
    return await Phone.aggregate([
      { $match: match },
      {
        $addFields: {
          reviewScore: {
            $cond: [
              { $gt: ["$reviews", 0] },
              {
                $divide: [
                  {
                    $multiply: [
                      "$ratingFloat",
                      { $log10: { $add: ["$reviews", 1] } },
                    ],
                  },
                  "$price",
                ],
              },
              0,
            ],
          },
          // Improved proximity calculation
          priceProximity: {
            $exp: {
              $multiply: [
                -0.00005, // This controls how quickly the score drops as price differs
                { $pow: [{ $subtract: ["$price", priceMax] }, 2] },
              ],
            },
          },
        },
      },
      {
        $addFields: {
          // Combine scores with more emphasis on price proximity
          finalScore: {
            $multiply: [
              "$reviewScore",
              { $pow: ["$priceProximity", 2] }, // Squaring gives even more weight to price
            ],
          },
        },
      },
      { $sort: { finalScore: -1 } },
      { $limit: 8 },
    ]);
  } catch (e) {
    console.error("Error querying phones:", e);
    throw e;
  }
}

// Handle search request
export async function POST(request: Request) {
  try {
    await connectDB();
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    console.log("Received message:", message);

    const searchParams = await extractSearchParameters(message);

    console.log("Extracted search parameters:", searchParams);

    // @ts-ignore
    const conversation = await Conversations.create({
      userMsg: message,
      filters: searchParams,
    });

    const phones = await searchPhones(searchParams);

    return NextResponse.json({
      success: true,
      phones,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
