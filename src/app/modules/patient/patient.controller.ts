import { catchAsync } from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { sendResponse } from "../../../shared/sendResponse";
import { patientFilterableFields } from "./patient.constant";
import { PatientServices } from "./patient.service";
import httpStatus from 'http-status'

const getAllPatients = catchAsync(async(req, res) => {
  const filters = pick(req.query, patientFilterableFields);
  const options = pick(req.query, ["sortBy", "sortOrder", "page", "limit"]);
  const result = await PatientServices.getAllPatientsFromDB(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Patient retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});

const updatePatiendData = catchAsync(async(req, res) => {
    const result = await PatientServices.updatePatiendDataIntoDB(req.params.id, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Patient updated successfully",
      data: result
    });
  });

  const deletePatiendData = catchAsync(async(req, res) => {
    const result = await PatientServices.deletePatientDataFromDB(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Patient deleted successfully",
      data: result
    });
  });

export const PatientControllers = {
  getAllPatients,
  updatePatiendData,
  deletePatiendData
};
