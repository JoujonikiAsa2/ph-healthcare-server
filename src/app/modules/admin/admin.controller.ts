import { AdminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
const getAllAdmins = catchAsync(async (req, res) => {

  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await AdminServices.getAllAdminsFromDB(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin retrieved OKfully",
    data: result,
  })
})

const getAdminById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AdminServices.getAdminByIdFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin retrieved OKfully",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AdminServices.updateAdminIntoDB(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin updated OKfully",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AdminServices.deleteAdminFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin deleted OKfully",
    data: result,
  });
});

const softDeleteAdmin = catchAsync(async (req, res) => {

    const id = req.params.id;
    const result = await AdminServices.softDeleteAdminFromDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Admin deleted OKfully",
      data: result,
    });
});

export const AdminControllers = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
