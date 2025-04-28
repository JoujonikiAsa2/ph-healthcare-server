import { catchAsync } from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { sendResponse } from "../../../shared/sendResponse";
import { IOptionsResult } from "../../interfaces/pagination";
import { specialtiesFilterableFields } from "./specialties.constant";
import { ISpecialtiesFilterRequest } from "./specialties.interface";
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
  const filters = pick(req.query, specialtiesFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await SpecialtiesServices.getSpecialties(
    filters as ISpecialtiesFilterRequest,
    options
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Specialties retrieve successfully",
    meta: result.meta,
    data: result.data
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
  deleteSpecialties,
};
