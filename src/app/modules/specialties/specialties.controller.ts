import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { SpecialtiesServices } from "./specialties.service";
import httpStatus from "http-status";

const createSpecialties = catchAsync(async (req, res) => {
  const result = await SpecialtiesServices.createSpecialties(req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Specialties created successfully",
    data: result,
  });
});

const getSpecialties = catchAsync(async (req, res) => {
    const result = await SpecialtiesServices.getSpecialties();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Specialties retrieve successfully",
      data: result,
    });
  });


  const deleteSpecialties = catchAsync(async (req, res) => {
    console.log(req.params.id);
    const result = await SpecialtiesServices.deleteSpecialties(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Specialties deleted successfully",
      data: result,
    });
  });

export const SpecialtiesControllers = {
  createSpecialties,
  getSpecialties,
  deleteSpecialties
};
