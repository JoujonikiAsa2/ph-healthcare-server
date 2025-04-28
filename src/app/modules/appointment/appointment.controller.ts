import { Request } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { sendResponse } from "../../../shared/sendResponse";
import { AppointmentServices } from "./appointment.service";
import httpStatus from "http-status";
import { IAuthUser } from "../../interfaces/common";

const getAllAppointments = catchAsync(
  async (req: Request & { user?: IAuthUser }, res) => {
    // const user = req.user as IAuthUser;
    // const filters = pick(req.query, ["startDate", "endDate"]);
    // const options = pick(req.query, ["sortBy", "sortOrder", "page", "limit"]);
    // const result = await AppointmentServices.getAllAppointmentsFromDB(
    //   filters,
    //   options,
    //   user
    // );
    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.OK,
    //   message: "Appointment retrieved successfully",
    //   data: result,
    // });
  }
);

const getAppointmentByID = catchAsync(async (req, res) => {
  // const appointmentId = req.params.appointmentId;
  // const result = await AppointmentServices.createAppointmentSlot(appointmentId);
  // sendResponse(res, {
  //   statusCode: httpStatus.OK,
  //   success: true,
  //   message: "Appointment retrived successfully",
  //   data: result,
  // });
});

const createAppointment = catchAsync(async (req: Request & {user?: IAuthUser}, res) => {
  const user =  req.user as IAuthUser
  const result = await AppointmentServices.createAppointment(user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Appointment created successfully",
    data: result,
  });
});

const deleteAppointment = catchAsync(async (req, res) => {
  // const appointmentId = req.params.appointmentId;
  // const result = await AppointmentServices.deleteScheduleFromDB(appointmentId);
  // sendResponse(res, {
  //   statusCode: httpStatus.OK,
  //   success: true,
  //   message: "Appointment deleted sccessfully",
  //   data: result,
  // });
});

export const AppoinmentControllers = {
  getAllAppointments,
  getAppointmentByID,
  createAppointment,
  deleteAppointment,
};
