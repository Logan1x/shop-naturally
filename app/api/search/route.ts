import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimiter";
import Conversations from "@/lib/models/conversations";
import connectDB from "@/lib/db";
import { extractSearchParameters } from "@/lib/search/extractSearchParameters";

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
      "best phones under ₹15,000": { price_max: 15000, sort_by: "reviews" },
      "phones with 64gb storage": { storage: "64GB", sort_by: "reviews" },
      "top rated 5g phones": { has_feature: "5G", sort_by: "reviews" },
      "most reviewed phones under ₹20,000": {
        price_max: 20000,
        price_min: 11000,
        sort_by: "reviews",
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
