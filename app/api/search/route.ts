import { NextResponse } from "next/server";
import OpenAI from "openai";
import Phone from "@/lib/models/phone";
import Conversations from "@/lib/models/conversations";
import connectDB from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractSearchParameters(message) {
  const tools = [
    {
      type: "function",
      function: {
        name: "search_phones",
        description: "Search for phones based on various criteria.",
        parameters: {
          type: "object",
          properties: {
            price_min: {
              type: "number",
              description: "Minimum price of the phone.",
            },
            price_max: {
              type: "number",
              description: "Maximum price of the phone.",
            },
            ram: {
              type: "string",
              description: "The RAM of the phone (e.g., '8GB', '12 GB').",
            },
            os: {
              type: "string",
              description:
                "The operating system of the phone (e.g., 'Android', 'iOS').",
            },
            color: {
              type: "string",
              description: "The color of the phone (e.g., 'Black', 'Blue').",
            },
            manufacturer: {
              type: "string",
              description:
                "The manufacturer of the phone (e.g., 'Samsung', 'Apple').",
            },
            rating_min: {
              type: "string",
              description: "minimum rating (e.g. 4, 4.5, 3 out of 5, 2/5)",
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
          "You are a helpful assistant that extracts search parameters for phones.",
      },
      {
        role: "user",
        content: message,
      },
    ],
    tools: tools as any,
    tool_choice: "auto",
  });

  const toolCalls = response.choices[0].message.tool_calls;

  if (toolCalls) {
    for (const toolCall of toolCalls) {
      if (toolCall.function.name === "search_phones") {
        try {
          const argumentsParsed = JSON.parse(toolCall.function.arguments);
          return argumentsParsed;
        } catch (error) {
          console.error("Error parsing function arguments:", error);
          return {};
        }
      }
    }
  }

  return {};
}

async function searchPhones(filters) {
  const query: any = {};

  if (filters.price_min) {
    query.price = { ...query.price, $gte: filters.price_min };
  }
  if (filters.price_max) {
    query.price = { ...query.price, $lte: filters.price_max };
  }
  if (filters.ram) {
    query["technical_details.RAM"] = { $regex: new RegExp(filters.ram, "i") }; // Case-insensitive search
  }
  if (filters.os) {
    query["technical_details.OS"] = { $regex: new RegExp(filters.os, "i") };
  }
  if (filters.color) {
    query["technical_details.Colour"] = {
      $regex: new RegExp(filters.color, "i"),
    };
  }
  if (filters.manufacturer) {
    query["technical_details.Manufacturer"] = {
      $regex: new RegExp(filters.manufacturer, "i"),
    };
  }
  if (filters.rating_min) {
    query["rating"] = {
      $regex: new RegExp(`^${filters.rating_min.split("/")[0]}`),
      $options: "i",
    };
  }
  console.log("Mongo Query:", query);

  try {
    // @ts-expect-error - We're not using all the fields from the model
    const phones = await Phone.find(query).limit(5).exec(); // Limit to 5 results
    return phones;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const searchParams = await extractSearchParameters(message);
    console.log("Extracted Search Parameters:", searchParams);

    const conversation = await new Conversations({
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
    console.error("Error during search:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
