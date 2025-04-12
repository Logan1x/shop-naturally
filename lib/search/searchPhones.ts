import Phone from "@/lib/models/phone";

// Search phones based on extracted filters
export async function searchPhones(filters: any) {
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
