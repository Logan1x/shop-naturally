import mongoose from "mongoose";

const phoneSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    main_url: { type: String, required: true },
    price: { type: Number, required: true },
    reviews: { type: String },
    rating: { type: String },
    bought: { type: String },
    technical_details: {
      OS: String,
      RAM: String,
      "Product Dimensions": String,
      Batteries: String,
      "Item model number": String,
      "Connectivity technologies": String,
      GPS: String,
      "Special features": String,
      "Other display features": String,
      "Device interface - primary": String,
      Resolution: String,
      "Other camera features": String,
      "Audio Jack": String,
      "Form factor": String,
      Colour: String,
      "Battery Power Rating": String,
      "Whats in the box": String,
      Manufacturer: String,
      "Item Weight": String,
    },
    additional_informations: {
      ASIN: String,
      "Customer Reviews": String,
      "Best Sellers Rank": String,
      "Date First Available": String,
      Manufacturer: String,
      Packer: String,
      Importer: String,
      "Item Dimensions LxWxH": String,
      "Net Quantity": String,
      "Generic Name": String,
    },
    stock_status: { type: String },
    crawl_date: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Phone || mongoose.model("Phone", phoneSchema);
