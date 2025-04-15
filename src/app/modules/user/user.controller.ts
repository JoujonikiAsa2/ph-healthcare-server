import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status"

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.createAdmin(req.body);
    sendResponse(res,({
          success: true,
          statusCode: httpStatus.OK,
          message: "Admin created successfully",
          data: result,
        }))
  } catch (error:any) {
    next(error)
  }
};

export const UserControllers = {
  createAdmin,
};
