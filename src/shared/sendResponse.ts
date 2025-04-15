import { Request, Response } from "express";

export const sendResponse = <T>(
  res: Response,
  response: {
    message: string;
    statusCode: number;
    success: boolean;
    data: T | null;
    meta?: {
      page: number;
      limit: number;
      total: number;
    };
  }
) => {
  const { message, statusCode, success, data, meta } = response;
  res.status(statusCode).json({
    success,
    message,
    meta,
    data,
  });
};
