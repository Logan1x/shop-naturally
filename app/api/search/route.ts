import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimiter";
import { extractSearchParameters } from "@/lib/search/extractSearchParameters";
import { searchPhones } from "@/lib/search/searchPhones";
import pool from "@/lib/db";

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
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    console.log("Received message:", message);

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

    const normalizedMsg = message.trim().toLowerCase();

    let searchParams: any = null;

    for (const [query, filters] of Object.entries(specialQueries)) {
      if (normalizedMsg === query) {
        searchParams = { ...filters };
        break;
      }
    }

    if (!searchParams) {
      searchParams = await extractSearchParameters(normalizedMsg);
    }

    console.log("Extracted search parameters:", searchParams);

    // Log conversation
    try {
      await pool.query(
        "INSERT INTO conversations (user_msg, filters) VALUES ($1, $2)",
        [message, JSON.stringify(searchParams)]
      );
    } catch (logErr) {
      console.error("Failed to log conversation:", logErr);
    }

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
      });
    }

    const phones = await searchPhones(searchParams);

    return NextResponse.json({
      success: true,
      phones,
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
