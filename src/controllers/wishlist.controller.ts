//get wishlist

import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import { User } from "../models/user.models";
import { CustomError } from "../middlewares/error-handler.middleware";
import { Product } from "../models/product.models";

export const getWishList = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate("wish_list");

  if (!user) {
    throw new CustomError("wishList not found!", 404);
  }

  res.status(200).json({
    message: "Fetched wishList",
    status: "Success",
    success: true,
    data: user.wish_list ?? [],
  });
});

//add wishlist

export const addToWishLit = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.body._id;
    const userId = req.user._id;

    if (!productId) {
      throw new CustomError("product id is required!", 400);
    }

    // check product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new CustomError("product not found!", 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("user not found!", 404);
    }

    // check if product already exists in wishlist
    const exists = user.wish_list.some(
      (id) => id.toString() === product._id.toString()
    );

    if (exists) {
      // remove product
      // user.wish_list = user.wish_list.filter(
      //   (id) => id.toString() !== product._id.toString()
      // );
      // await user.save();

      return res.status(200).json({
        message: "product already exist in wishlist",
        success: true,
        data: user.wish_list,
      });
    } else {
      // add product
      user.wish_list.push(product._id);
      await user.save();

      return res.status(200).json({
        message: "product added to wishlist",
        success: true,
        data: user.wish_list,
      });
    }
  }
);

// remove product from wishlist

export const removeWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.body._id;
    const userId = req.user._id;

    if (!productId) {
      throw new CustomError("product id is required! ", 401);
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new CustomError("User doesn't exist", 401);
    }

    const wishlist = user.wish_list.filter(
      (id) => id.toString() !== productId.toString()
    );

    await user.save();

    return res.status(200).json({
      message: "product removed from wishlist",
      status: "Success",
      success: true,
      data: wishlist,
    });
  }
);

//clear wishlist

export const clearWishList = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    user.set("wish_list", []);

    // user.wish_list.splice(0, user.wish_list.length)
    await user.save();

    res.status(200).json({
      message: "Wishlist successfully deleted",
      success: true,
      status: "success",
      data: user.wish_list,
    });
  }
);
