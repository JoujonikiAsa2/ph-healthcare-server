import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status"

export const globalErrorHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = error?.message || "Something went wrong";
  const stack = error?.stack || null;
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    statusCode,
    message,
    error,
    stack,
  });
};
