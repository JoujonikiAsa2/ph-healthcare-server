import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status"
import { catchAsync } from "../../../shared/catchAsync";

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.createAdmin(req.body);
  sendResponse(res,({
        success: true,
        statusCode: httpStatus.OK,
        message: "Admin created successfully",
        data: result,
      }))
})

export const UserControllers = {
  createAdmin,
};
