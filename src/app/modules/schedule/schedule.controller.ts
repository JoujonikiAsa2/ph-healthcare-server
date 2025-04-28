import { Request } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { sendResponse } from "../../../shared/sendResponse";
import { ShceduleServices } from "./schedule.service";
import httpStatus from "http-status";
import { IAuthUser } from "../../interfaces/common";

const getAllSchedules = catchAsync(
  async (req: Request & { user?: IAuthUser }, res) => {
    const user = req.user as IAuthUser;
    const filters = pick(req.query, ["startDate", "endDate"]);
    const options = pick(req.query, ["sortBy", "sortOrder", "page", "limit"]);
    const result = await ShceduleServices.getAllSchedulesFromDB(
      filters,
      options,
      user
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Schedule retrieved successfully",
      data: result,
    });
  }
);

const getScheduleByID = catchAsync(async (req, res) => {
  const scheduleId = req.params.id;
  const result = await ShceduleServices.getScheduleByIDFromDB(scheduleId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule retrived successfully",
    data: result,
  });
});

const createSchedule = catchAsync(async (req, res) => {
  const result = await ShceduleServices.createScheduleSlot(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Schedule created successfully",
    data: result,
  });
});

const deleteSchedule = catchAsync(async (req, res) => {
  const scheduleId = req.params.id;
  const result = await ShceduleServices.deleteScheduleFromDB(scheduleId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule deleted sccessfully",
    data: result,
  });
});

export const ScheduleControllers = {
  getAllSchedules,
  getScheduleByID,
  createSchedule,
  deleteSchedule,
};
