import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    brand_name: {
      type: String,
      required: [true, "Brand_name is required !"],
      trim: true,
      unique: [true, "Brand name already exists"],
      maxLength: 50,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "brand description is required !"],
    },
    logo: {
      path: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    categories: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Brand = mongoose.model("Brand", brandSchema);
