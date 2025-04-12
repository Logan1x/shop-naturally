import mongoose from "mongoose";

const phoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "Redmi Note 14 5G"
    brand: { type: String, required: true }, // e.g., "Xiaomi"
    fullName: { type: String, required: true }, // Full product title
    ram: { type: Number, required: true }, // e.g., 6 (GB)
    storage: { type: Number, required: true }, // e.g., 128 (GB)
    price: { type: Number, required: true }, // Converted from string to number
    rating: { type: String }, // e.g., "3.7 out of 5 stars"
    ratingFloat: { type: Number }, // e.g., 3.7
    reviews: { type: Number }, // e.g., 421
    bought: { type: Number }, // e.g., 5000
    isInStock: { type: Boolean, required: true }, // Boolean field for stock status
    productUrl: { type: String, required: true }, // Product link (you'll add this)
    scrapedAt: { type: Date, required: true }, // Date field for scraped timestamp
  },
  { timestamps: true }
);

export default mongoose.models.Phone || mongoose.model("Phone", phoneSchema);
