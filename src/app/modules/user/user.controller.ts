import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.createAdmin(req.body);
    res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error:any) {
    res.status(500).json({
      success: false,
      message: error?.name || "Failed to create admin",
      error,
    });
  }
};

export const UserControllers = {
  createAdmin,
};
