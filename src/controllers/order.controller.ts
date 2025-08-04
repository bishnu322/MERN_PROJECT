import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import { CustomError } from "../middlewares/error-handler.middleware";
import { Product } from "../models/product.models";
import { Order } from "../models/order.models";
import { Order_status } from "../types/enum.types";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { items, shipping_address } = req.body;

  const user = req.user._id;

  if (!items) {
    throw new CustomError("items is required", 400);
  }

  if (!shipping_address) {
    throw new CustomError("shipping_address is required", 400);
  }

  const address = JSON.parse(shipping_address);
  const orderItems: { product: string; quantity: string }[] = JSON.parse(items);

  const order = await Promise.all(
    orderItems.map(async (item: { product: string; quantity: string }) => {
      const product = await Product.findById(item.product);

      if (!product) {
        return null;
      }

      // product.stock -= Number(items.)

      // await Cart.findOneAndDelete()

      return {
        product: product._id,
        quantity: Number(item.quantity),
        total_price: Number(item.quantity) * product.price,
      };
    })
  );

  const filteredItem = order.filter((order) => order !== null);

  const total_amount = filteredItem.reduce((acc: any, val: any) => {
    return (acc += Number(val.total_price));
  });

  const newOrder = await Order.create({
    items: filteredItem,
    total_amount,
    shipping_address: address,
    user,
  });

  res.status(201).json({
    message: "order created successfully",
    status: "Success",
    success: true,
    data: newOrder,
  });
});

// get all order (only admin)

export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user._id;

    const orders = await Order.find({ user }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "all order fetched successfully",
      status: "Success",
      success: true,
      data: orders,
    });
  }
);

// get users order (only user)
export const getAllUserByOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new CustomError("no order placed", 400);
    }

    const userOrder = await Order.find({ userId });

    res.status(200).json({
      message: "user order fetched....",
      status: "Success",
      success: true,
      data: userOrder,
    });
  }
);

//get order Status(admin)
export const getOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.query;

    if (!status || typeof status !== "string") {
      throw new CustomError("Order status is required", 400);
    }

    if (!Object.values(Order_status).includes(status as Order_status)) {
      throw new CustomError("Invalid order status", 400);
    }

    const orders = await Order.find({ status })
      .populate("user")
      .populate("items.product");

    res.status(200).json({
      message: "order fetched by status",
      status: "Success",
      success: true,
      order_length: orders.length,
      data: orders,
    });
  }
);

// cancel order(only)
export const cancel = asyncHandler(async (req: Request, res: Response) => {});
