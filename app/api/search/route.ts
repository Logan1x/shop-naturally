import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimiter";
import Conversations from "@/lib/models/conversations";
import connectDB from "@/lib/db";
import { extractSearchParameters } from "@/lib/search/extractSearchParameters";
import { searchPhones } from "@/lib/search/searchPhones";

// Handle search request
export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for") || (request as any).ip || "unknown";

  const { allowed, retryAfterSeconds } = checkRateLimit(ip);

  if (!allowed) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": retryAfterSeconds.toString(),
      },
    });
  }

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

    // List of special queries and their corresponding filters
    const specialQueries: { [key: string]: any } = {
      "best phones under ₹15,000": { price_max: 15000, price_min: 10000 },
      "phones with 64gb storage": { storage: 64 },
      "top rated 5g phones": { has_feature: "5G", sort_by: "rating" },
      "most reviewed phones under ₹20,000": {
        price_max: 20000,
        reviews_min: 1,
        sort_by: "popularity",
      },
    };

    // Normalize message for matching
    const normalizedMsg = message.trim().toLowerCase();

    let searchParams: any = null;

    for (const [query, filters] of Object.entries(specialQueries)) {
      if (normalizedMsg === query) {
        searchParams = { ...filters };
        break;
      }
    }

    if (!searchParams) {
      // Fallback to OpenAI extraction for non-special queries
      searchParams = await extractSearchParameters(normalizedMsg);
    }

    console.log("Extracted search parameters:", searchParams);

    // @ts-ignore
    const conversation = await Conversations.create({
      userMsg: message,
      filters: searchParams,
    });

    // If searchParams is empty object, return no results found
    if (
      searchParams &&
      typeof searchParams === "object" &&
      Object.keys(searchParams).length === 0
    ) {
      return NextResponse.json({
        success: false,
        phones: [],
        message:
          "No results found. Please try again with different search terms.",
        conversationId: conversation._id,
      });
    }

    const phones = await searchPhones(
      searchParams,
      conversation._id.toString()
    );

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
