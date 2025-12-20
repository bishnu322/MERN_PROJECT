import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import { CustomError } from "../middlewares/error-handler.middleware";
import { Cart } from "../models/cart.models";
import { Product } from "../models/product.models";
import mongoose from "mongoose";

// create cart
export const createCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  const { _id: userId } = req.user;

  if (!productId) {
    throw new CustomError("Product id required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new CustomError("Invalid product id", 400);
  }

  const qty = Number(quantity) || 1;

  // find or create product
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
      total_amount: 0,
    });
  }

  // find product
  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError("Product not found", 404);
  }
  // check product is already exist
  const existingItem = cart.items.find((item) =>
    item?.product?.equals(product._id)
  );

  if (existingItem) {
    // update quantity
    existingItem.quantity += qty;

    // update total price of item
    existingItem.total_price = existingItem.quantity * product.price;
  } else {
    // add new item
    cart.items.push({
      product: product._id,
      quantity: qty,
      total_price: qty * product.price,
    });
  }

  // recalculate to amount
  cart.total_amount = cart.items.reduce(
    (sum, item) => sum + item.total_price,
    0
  );

  await cart.save();
  // populate after saving
  await cart.populate([
    { path: "user", select: "-password" },
    { path: "items.product" },
  ]);

  res.status(200).json({
    success: true,
    status: "success",
    message: "Product added to cart",
    data: cart,
  });
});

// get by cart

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user._id;

  const cart = await Cart.findOne({ user })
    .populate({ path: "user" })
    .populate({
      path: "items.product",
      populate: [
        {
          path: "brand",
          model: "Brand",
        },
        {
          path: "category",
          model: "Category",
        },
      ],
    });

  if (!cart) {
    throw new CustomError("Cart is not created yet", 400);
  }

  res.status(200).json({
    message: "cart fetched",
    success: true,
    status: "success",
    data: cart,
  });
});
