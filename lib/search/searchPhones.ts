import Phone from "@/lib/models/phone";

// Search phones based on extracted filters
export async function searchPhones(filters: any) {
  const match: any = {};

  // Basic filters

  // Price
  if (filters.price_min !== undefined)
    match.price = { ...match.price, $gte: filters.price_min };
  if (filters.price_max !== undefined)
    match.price = { ...match.price, $lte: filters.price_max };

  // RAM: exact value takes precedence over min/max
  if (filters.ram !== undefined) {
    match.ram = filters.ram;
  } else {
    if (filters.ram_min !== undefined)
      match.ram = { ...match.ram, $gte: filters.ram_min };
    if (filters.ram_max !== undefined)
      match.ram = { ...match.ram, $lte: filters.ram_max };
  }

  // Storage: exact value takes precedence over min/max
  if (filters.storage !== undefined) {
    match.storage = filters.storage;
  } else {
    if (filters.storage_min !== undefined)
      match.storage = { ...match.storage, $gte: filters.storage_min };
    if (filters.storage_max !== undefined)
      match.storage = { ...match.storage, $lte: filters.storage_max };
  }
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

  // Popularity filter (bought is now a number)
  if (filters.popularity_min !== undefined) {
    match.bought = { ...match.bought, $gte: filters.popularity_min };
  }

  // Simplified recommendation logic
  // If price_max is specified, filter to [price_max - 10000, price_max]
  if (filters.price_max) {
    const minPrice = filters.price_min || Math.max(0, filters.price_max - 5000);
    match.price = { $gte: minPrice, $lte: filters.price_max };
  }

  console.log({ match });

  try {
    return await Phone.aggregate([
      { $match: match },
      {
        // Add a calculated score field based on weighted parameters
        $addFields: {
          score: {
            $add: [
              // Assign higher weights to bought and reviews
              { $multiply: [{ $ifNull: ["$bought", 0] }, 4] },
              { $multiply: [{ $ifNull: ["$reviews", 0] }, 3] },
              { $multiply: [{ $ifNull: ["$ratingFloat", 0] }, 2] },
              // Lower weights for RAM and storage
              { $multiply: [{ $ifNull: ["$ram", 0] }, 1] },
              { $multiply: [{ $ifNull: ["$storage", 0] }, 1] },
            ],
          },
        },
      },
      {
        // Sort primarily by the calculated score in descending order
        $sort: {
          score: -1,
          price: 1, // Tie-breaker
        },
      },
      // --- Start Brand Diversity Logic ---
      {
        // Group by brand, keeping the sorted phones within each group
        $group: {
          _id: "$brand",
          phones: { $push: "$$ROOT" }, // Push the whole document
        },
      },
      {
        // Limit each brand group to a maximum of 4 phones
        $project: {
          brand: "$_id",
          topPhones: { $slice: ["$phones", 4] }, // Take the top 4 (already sorted)
        },
      },
      {
        // Unwind the limited phone arrays back into individual documents
        $unwind: "$topPhones",
      },
      {
        // Promote the phone document back to the root level
        $replaceRoot: { newRoot: "$topPhones" },
      },
      // --- End Brand Diversity Logic ---
      {
        // Re-sort the diversified list by the original score and price
        $sort: {
          score: -1,
          price: 1,
        },
      },
      {
        // Take the final top 8 from the diversified pool
        $limit: 8,
      },
    ]);
  } catch (e) {
    console.error("Error querying phones:", e);
    throw e;
  }
}
