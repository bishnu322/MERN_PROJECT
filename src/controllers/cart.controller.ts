import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import { CustomError } from "../middlewares/error-handler.middleware";
import { Cart } from "../models/cart.models";
import { Product } from "../models/product.models";

// create cart
export const createCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  const { _id: userId } = req.user;

  let cart;

  if (!productId) {
    throw new CustomError("product id required", 400);
  }

  cart = await Cart.findOne({ user: userId })
    .populate({ path: "user" })
    .populate({ path: "items.product" });

  if (!cart) {
    cart = await Cart.create({ user: userId, total_amount: 0 });
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError("product not found", 404);
  }

  const isAlreadyExist = cart.items.find((item) => item.product === productId);

  if (isAlreadyExist) {
    isAlreadyExist.quantity += Number(quantity);
    cart.total_amount =
      cart.total_amount -
      isAlreadyExist.total_price +
      isAlreadyExist.quantity * product.price;
  } else {
    const total_price = Number(quantity) * product.price;
    const total_amount = cart.total_amount + total_price;
    cart.total_amount = total_amount;
    cart.items.push({ total_price, product: product._id, quantity });
  }

  await cart.save();

  res.status(200).json({
    message: "product added to cart",
    status: "success",
    success: true,
    data: cart,
  });
});

// get by cart

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user._id;

  const cart = await Cart.findOne({ user })
    .populate({ path: "user" })
    .populate({ path: "items.product" });

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

// updateCart=
