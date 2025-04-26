import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { DoctorServices } from "./doctor.service";
import pick from "../../../shared/pick";
import { IDoctorFilterRequest } from "./doctor.interface";
import { adminFilterableFields } from "../admin/admin.constant";

const getAllDoctors = catchAsync(async (req, res) => {
  const filters  = pick(req.query, adminFilterableFields )
  const options =  pick(req.query, ["page", "limit", "sortBy", "sortOrder"])
  const result = await DoctorServices.getAllDoctors(filters as IDoctorFilterRequest, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Specialties retrieved successfully",
    data: result,
  });
});

const updateDoctorInfo = catchAsync(async (req, res) => {
  const result = await DoctorServices.uploadDoctorInfo(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Specialties updated successfully",
    data: result,
  });
});

export const DoctorControllers = {
  getAllDoctors,
  updateDoctorInfo
};
