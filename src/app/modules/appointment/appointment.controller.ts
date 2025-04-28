import { Request } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { sendResponse } from "../../../shared/sendResponse";
import { AppointmentServices } from "./appointment.service";
import httpStatus from "http-status";
import { IAuthUser } from "../../interfaces/common";
import { appointmentFilterableFields } from "./appointment.constant";

const getAllAppointments = catchAsync(
  async (req: Request & { user?: IAuthUser }, res) => {
    const user = req.user as IAuthUser;
    const filters = pick(req.query, appointmentFilterableFields);
    const options = pick(req.query, ["sortBy", "sortOrder", "page", "limit"]);
    const result = await AppointmentServices.getAllAppointmentsFromDB(
      user,
      filters,
      options
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Appointments retrieved successfully",
      data: result,
    });
  }
);

const getMyAppointment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res) => {
    const user = req.user as IAuthUser;
    const filters = pick(req.query, ["status", "paymentStatus"]);
    const options = pick(req.query, ["sortBy", "sortOrder", "page", "limit"]);
    const result = await AppointmentServices.getMyAppointmentFromDB(
      user,
      filters,
      options
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My appointment retrived successfully",
      data: result,
    });
  }
);

const createAppointment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res) => {
    const user = req.user as IAuthUser;
    const result = await AppointmentServices.createAppointment(user, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Appointment created successfully",
      data: result,
    });
  }
);

const deleteAppointment = catchAsync(async (req, res) => {
  const appointmentId = req.params.appointmentId;
  const result = await AppointmentServices.deleteAppointmentFromDB(
    appointmentId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment deleted sccessfully",
    data: null,
  });
});

export const AppoinmentControllers = {
  getAllAppointments,
  getMyAppointment,
  createAppointment,
  deleteAppointment,
};
