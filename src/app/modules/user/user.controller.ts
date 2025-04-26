import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { IFile } from "../../interfaces/file";
import { userFilterableFields } from "./user.constant";
import pick from "../../../shared/pick";

const createAdmin = catchAsync(async (req, res) => {
  const file = req.file as IFile;
  const result = await UserServices.createAdmin(file, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Admin created successfully",
    data: result,
  });
});

const createDoctor = catchAsync(async (req, res) => {
  const file  = req.file as IFile;
  const result = await UserServices.createDoctor(file, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Doctor created successfully",
    data: result,
  });
});

const createPatient = catchAsync(async (req, res) => {
  const file = req.file as IFile;
  const result = await UserServices.createPatient(file, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Patient created successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await UserServices.getAllUsers(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result,
  });
});

const changeProfileStatus = catchAsync(async (req, res) => {
  const {id} = req.params
  const result = await UserServices.changeProfileStatus(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile status changed!",
    data: result,
  });
});

const getProfileInfo = catchAsync(async (req:Request & { user?: any }, res) => {
  const user = req?.user;
  console.log(user);
  const result = await UserServices.getProfileInfo(user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User info retrieved successfully",
    data: result,
  });
});

const updateProfileInfo = catchAsync(async (req:Request & { user?: any }, res) => {
  const user = req.user
  const result = await UserServices.updateProfileInfo(user, req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User info updated successfully",
    data: result,
  });
});

export const UserControllers = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
  changeProfileStatus,
  getProfileInfo,
  updateProfileInfo
};
