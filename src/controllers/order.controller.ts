import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import { CustomError } from "../middlewares/error-handler.middleware";
import { Product } from "../models/product.models";
import { Order } from "../models/order.models";
import { Order_status } from "../types/enum.types";
import { sendEmail } from "../utils/mailer.utils";
import { Cart } from "../models/cart.models";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { items, shipping_address } = req.body;
  const user = req.user._id;

  if (!items) {
    throw new CustomError("items required", 400);
  }
  if (!shipping_address) {
    throw new CustomError("shipping_address required", 400);
  }

  const address = JSON.parse(shipping_address);
  const orderItems: { product: string; quantity: string }[] = JSON.parse(items);

  // *  preparing order items  with price
  const order = await Promise.all(
    orderItems.map(async (item: { product: string; quantity: string }) => {
      const product = await Product.findById(item.product);

      if (!product) {
        return null;
      }

      //*   reduning products stock
      product.stock -= Number(item.quantity);
      await product.save();
      return {
        product: product._id,
        quantity: Number(item.quantity),
        total_price: Number(item.quantity) * product.price,
      };
    })
  );

  //*   filter null elements
  const filteredOrderItems = order.filter((order) => order !== null);

  // * calculating  total amount
  const total_amount = filteredOrderItems.reduce((acc, val) => {
    return (acc += Number(val.total_price));
  }, 0);

  console.log(user);
  //* placing order
  const newOrder = await Order.create({
    user,
    items: filteredOrderItems,
    total_amount,
    shipping_address: address,
  });

  const orderPlaced = await Order.findById(newOrder._id)
    .populate("items.product")
    .populate("user");

  // ! deleting cart after order is placed
  await Cart.findOneAndDelete({ user });

  await sendEmail({
    // html: generate_order_confirmation_email(orderPlaced),
    html: "",
    subject: "Order Confirmed",
    to: "sunya.sagarbhandari@gmail.com",
  });

  res.status(201).json({
    message: "order placed",
    data: newOrder,
    success: true,
    status: "success",
  });
});

//* get all orders (only admin)

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });

  res.status(200).json({
    message: "All order fetched",
    data: orders,
    success: true,
    status: "success",
  });
});

//* get user order (only user)
export const getAllByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user._id;

    const orders = await Order.find({ user }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "All order fetched",
      data: orders,
      success: true,
      status: "success",
    });
  }
);

//* update order status (admin)

export const updateStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({
      message: "Order Status updated",
      data: order,
      success: true,
      status: "success",
    });
  }
);

//* cancel order (only)

export const cancel = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await Order.findByIdAndUpdate(
    id,
    { status: Order_status.CANCELLED },
    { new: true }
  );
  res.status(200).json({
    message: "Order Cancelled",
    data: order,
    success: true,
    status: "success",
  });
});
