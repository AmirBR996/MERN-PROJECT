import mongoose from "mongoose";

const vegetablePriceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vegetable name is required"],
      trim: true,
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
    },
    minimum: {
      type: Number,
      required: [true, "Minimum price is required"],
      min: [0, "Price cannot be negative"],
    },
    maximum: {
      type: Number,
      required: [true, "Maximum price is required"],
      min: [0, "Price cannot be negative"],
    },
    average: {
      type: Number,
      required: [true, "Average price is required"],
      min: [0, "Price cannot be negative"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      index: true,
    },
    source: {
      type: String,
      default: "RamroPatro",
    },
  },
  {
    timestamps: true,
  }
);

vegetablePriceSchema.index({ name: 1, date: 1 }, { unique: true });

const VegetablePrice = mongoose.model("VegetablePrice", vegetablePriceSchema);
export default VegetablePrice;
