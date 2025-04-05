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
            price_min: { type: "number", description: "Minimum phone price." },
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
        content: "Extract structured search parameters for phone queries.",
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
  match.bought = { $ne: "N/A" };

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
          proximityBoost: {
            $subtract: [
              1,
              {
                $divide: [
                  { $abs: { $subtract: ["$price", priceMax] } },
                  priceMax,
                ],
              },
            ],
          },
        },
      },
      {
        $addFields: {
          finalScore: {
            $multiply: ["$reviewScore", "$proximityBoost"],
          },
        },
      },
      { $sort: { finalScore: -1 } },
      { $limit: 5 },
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
