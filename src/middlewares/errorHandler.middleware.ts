import { NextFunction, Request, Response } from "express";

// CustomError handler
export class CustomError extends Error {
  statusCode: number;
  status: "error" | "fail";
  success: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.success = false;
    Error.captureStackTrace(this, CustomError);
  }
}

//Edge case errorHandler
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error?.statusCode || 500;
  const message = error?.message || "Internal Server Error";
  const success = error?.statusCode ?? "false";
  const status = error?.status || "error";

  res.status(statusCode).json({
    message,
    statusCode,
    status,
    data: null,
  });
};
