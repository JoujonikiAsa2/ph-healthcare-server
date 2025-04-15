import { NextFunction, Request, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status"
const getAllAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await AdminServices.getAllAdminsFromDB(filters, options);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Admin retrieved OKfully",
      data: result,
    });
  } catch (error:any) {
    next(error);
  }
};

const getAdminById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const result = await AdminServices.getAdminByIdFromDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Admin retrieved OKfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const result = await AdminServices.updateAdminIntoDB(id, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Admin updated OKfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const result = await AdminServices.deleteAdminFromDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Admin deleted OKfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const softDeleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const result = await AdminServices.softDeleteAdminFromDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Admin deleted OKfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminControllers = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
