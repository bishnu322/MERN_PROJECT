//get wishlist

import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import { User } from "../models/user.models";
import { CustomError } from "../middlewares/error-handler.middleware";
import { Product } from "../models/product.models";

export const getWishList = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate("wish_list.product");

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
    const productId = req.body;
    const userId = req.user._id;

    if (!productId) {
      throw new CustomError("product id is required !", 400);
    }

    const product = await Product.findById(productId.id);

    // console.log(product);
    if (!product) {
      throw new CustomError("product not found!", 404);
    }

    const user = await User.findById(userId);

    let isProductAlreadyExists = user?.wish_list.find(
      (id) => product._id.toString() === id.toString()
    );

    if (isProductAlreadyExists) {
      let list = user?.wish_list.filter(
        (id) => product.id.toString !== id.toString()
      );

      await user?.set("wish_list", list);

      return res.status(200).json({
        message: "product removed to wish_list",
        status: "Success",
        success: true,
      });
    }

    user?.wish_list.push(product._id);
    await user?.save();

    res.status(200).json({
      message: "product added to wish_list",
      status: "Success",
      success: true,
      data: user?.wish_list,
    });
  }
);

//remove wishlist

//clear wishlist

// cart
// user [{product , quantity , price}]
// total amount of cart
