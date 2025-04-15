import { Request, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await AdminServices.getAllAdminsFromDB(filters, options);
    res.status(200).json({
      status: 200,
      message: "Admin retrieve successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve admin",
      error,
    });
  }
};

export const AdminControllers = {
  getAllAdmins,
};
