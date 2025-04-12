import Phone from "@/lib/models/phone";

// Search phones based on extracted filters
export async function searchPhones(filters: any) {
  const match: any = {};

  // Basic filters
  if (filters.price_min)
    match.price = { ...match.price, $gte: filters.price_min };
  if (filters.price_max)
    match.price = { ...match.price, $lte: filters.price_max };
  if (filters.ram_min !== undefined)
    match.ram = { ...match.ram, $gte: filters.ram_min };
  if (filters.ram_max !== undefined)
    match.ram = { ...match.ram, $lte: filters.ram_max };
  if (filters.ram !== undefined) match.ram = filters.ram;

  if (filters.storage_min !== undefined)
    match.storage = { ...match.storage, $gte: filters.storage_min };
  if (filters.storage_max !== undefined)
    match.storage = { ...match.storage, $lte: filters.storage_max };
  if (filters.storage !== undefined) match.storage = filters.storage;
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
    const minPrice = Math.max(0, filters.price_max - 10000);
    match.price = { $gte: minPrice, $lte: filters.price_max };
  }

  console.log({ match });

  try {
    return await Phone.aggregate([
      { $match: match },
      {
        $sort: {
          storage: -1, // Then maximize storage
          ram: -1, // Maximize RAM
          bought: -1, // Then most bought
          reviews: -1, // Then most reviews
        },
      },
      { $limit: 8 },
    ]);
  } catch (e) {
    console.error("Error querying phones:", e);
    throw e;
  }
}
