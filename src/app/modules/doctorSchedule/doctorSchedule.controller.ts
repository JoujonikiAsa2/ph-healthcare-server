import { catchAsync } from "../../../shared/catchAsync";
import httpStatus from "http-status";
import { DoctorScheduleServices } from "./doctorSchedule.service";
import { sendResponse } from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { Request } from "express";
import pick from "../../../shared/pick";

const getMySchedules = catchAsync(
  async (req: Request & { user?: IAuthUser }, res) => {
    const user = req.user as IAuthUser;
    const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
    const options = pick(req.query, ["sortBy", "sortOrder", "page", "limit"]);
    const result = await DoctorScheduleServices.getMyScheduleFromDB(
      user,
      filters,
      options
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "My Schedule retrieved successfully",
      data: result,
    });
  }
);
const getAllDoctorSchedules = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
  const options = pick(req.query, ["sortBy", "sortOrder", "page", "limit"]);
  const result = await DoctorScheduleServices.getAllDoctorSchedulesFromDB(
    filters,
    options
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Doctor Schedules retrieved successfully",
    data: result,
  });
});

const createDoctorSchedule = catchAsync(
  async (req: Request & { user?: IAuthUser }, res) => {
    const user = req.user as IAuthUser;
    const result = await DoctorScheduleServices.createDoctorScheduleIntoDB(
      user,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Doctor Schedule created successfully",
      data: result,
    });
  }
);

const deleteDpctorSchedule = catchAsync(
  async (req: Request & { user?: IAuthUser }, res) => {
    const user = req.user as IAuthUser;
    const scheduleId = req.params.scheduleId;
    const result = await DoctorScheduleServices.deleteDpctorScheduleFromDB(
      user,
      scheduleId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Doctor Schedule created successfully",
      data: result,
    });
  }
);

export const DoctorScheduleControllers = {
  createDoctorSchedule,
  getMySchedules,
  getAllDoctorSchedules,
  deleteDpctorSchedule,
};
