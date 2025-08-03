import mongoose from "mongoose";
import { Order_status, Payment_method } from "../types/enum.types";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "product is required"],
        },
        quantity: {
          type: Number,
          required: [true, "quantity is required"],
        },
        total_price: {
          type: Number,
          required: [true, "total price is required"],
        },
      },
    ],
    total_amount: {
      type: Number,
      required: [true, "total amount is required"],
    },
    shipping_address: {
      country: {
        type: String,
        trim: true,
        default: "Nepal",
      },
      state: {
        type: String,
        trim: true,
        required: [true, "state is required"],
      },
      city: {
        type: String,
        trim: true,
        required: [true, "city is required"],
      },
      street: {
        type: String,
        trim: true,
        required: [true, "street is required"],
      },
    },
    status: {
      type: String,
      enum: Object.values(Order_status),
      default: Order_status.PENDING,
    },
    payment_method: {
      type: String,
      enum: Object.values(Payment_method),
      default: Payment_method.COD,
    },
  },

  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
