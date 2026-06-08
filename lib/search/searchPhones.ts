import pool from "@/lib/db";

export async function searchPhones(filters: any) {
  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  function addCondition(condition: string, value: any) {
    conditions.push(condition.replace(/\$\d+/, `$${paramIndex++}`));
    values.push(value);
  }

  // Price range (handle narrowing in one place)
  if (filters.price_max !== undefined) {
    let priceGap: number;
    if (filters.price_max <= 15000) {
      priceGap = 3000;
    } else if (filters.price_max <= 40000) {
      priceGap = 7000;
    } else {
      priceGap = 15000;
    }
    const calculatedMinPrice = Math.max(0, filters.price_max - priceGap);
    const minPrice = filters.price_min ?? calculatedMinPrice;
    const effectiveMinPrice = Math.min(minPrice, filters.price_max);

    addCondition(`price >= $1`, effectiveMinPrice);
    addCondition(`price <= $1`, filters.price_max);
  } else if (filters.price_min !== undefined) {
    addCondition(`price >= $1`, filters.price_min);
  }

  // RAM
  if (filters.ram !== undefined) {
    addCondition(`ram = $1`, filters.ram);
  } else {
    if (filters.ram_min !== undefined) {
      addCondition(`ram >= $1`, filters.ram_min);
    }
    if (filters.ram_max !== undefined) {
      addCondition(`ram <= $1`, filters.ram_max);
    }
  }

  // Storage
  if (filters.storage !== undefined) {
    addCondition(`storage = $1`, filters.storage);
  } else {
    if (filters.storage_min !== undefined) {
      addCondition(`storage >= $1`, filters.storage_min);
    }
    if (filters.storage_max !== undefined) {
      addCondition(`storage <= $1`, filters.storage_max);
    }
  }

  // Brand (case-insensitive partial match)
  if (filters.brand) {
    addCondition(`brand ILIKE $1`, `%${filters.brand}%`);
  }

  // Rating
  if (filters.rating_min) {
    addCondition(`rating_float >= $1`, filters.rating_min);
  }

  // Stock
  if (filters.isInStock !== undefined) {
    addCondition(`is_in_stock = $1`, filters.isInStock);
  }

  // Name search
  if (filters.name) {
    addCondition(`name ILIKE $1`, `%${filters.name}%`);
  }

  // Reviews
  if (filters.reviews_min) {
    addCondition(`reviews >= $1`, filters.reviews_min);
  }

  // Text search in full_name
  if (filters.search_term || filters.has_feature || filters.camera_quality) {
    const regexTerms: string[] = [];
    if (filters.search_term) regexTerms.push(filters.search_term);
    if (filters.has_feature) regexTerms.push(filters.has_feature);
    if (filters.camera_quality) regexTerms.push(filters.camera_quality);
    addCondition(`full_name ILIKE $1`, `%${regexTerms.join("|")}%`);
  }

  // Popularity
  if (filters.popularity_min !== undefined) {
    addCondition(`bought >= $1`, filters.popularity_min);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const query = `SELECT * FROM phones ${whereClause}`;

  console.log("SQL:", query);
  console.log("Values:", values);

  try {
    const { rows: rawPhones } = await pool.query(query, values);

    // Map snake_case to camelCase for frontend
    const phones = rawPhones.map((p) => ({
      ...p,
      fullName: p.full_name,
      ratingFloat: p.rating_float,
      isInStock: p.is_in_stock,
      productUrl: p.product_url,
      scrapedAt: p.scraped_at,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));

    // Score and rank in JS
    const scored = phones.map((phone) => ({
      ...phone,
      score:
        (phone.bought || 0) * 4 +
        (phone.reviews || 0) * 3 +
        (phone.rating_float || 0) * 2 +
        (phone.ram || 0) +
        (phone.storage || 0),
    }));

    scored.sort((a, b) => b.score - a.score || a.price - b.price);

    // Brand diversity: max 4 per brand
    const brandCounts: Record<string, number> = {};
    const diversified: typeof scored = [];
    for (const phone of scored) {
      const count = brandCounts[phone.brand] || 0;
      if (count < 4) {
        diversified.push(phone);
        brandCounts[phone.brand] = count + 1;
      }
    }

    diversified.sort((a, b) => b.score - a.score || a.price - b.price);
    return diversified.slice(0, 8);
  } catch (e) {
    console.error("Error querying phones:", e);
    throw e;
  }
}
