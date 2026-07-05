import mongoose  from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Product description is required"]
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"]
    },
    category: {
      type: String,
      enum: ["Vegetables", "Fruits", "Grains", "Dairy", "Meat", "Other"],
      required: [true, "Product category is required"]
    },
    image_url: {
      type: String,
      required: [true, "Product image URL is required"]
    }, 
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"]
    },
    unit: {
      type: String,
      enum: ["kg", "dozen", "litre", "piece", "bundle"],
      default: "kg"
    },
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller ID is required"]
    }
  },
  { timestamps: true }
);

const krishik_Product = mongoose.model("Product", productSchema);
export default krishik_Product;