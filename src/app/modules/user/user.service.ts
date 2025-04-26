import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import {
  Admin,
  Doctor,
  Patient,
  Prisma,
  UserRole,
  UserStatus,
} from "../../../../generated/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { userSearchableFields } from "./user.constant";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";
import { IFile } from "../../interfaces/file";
import { Request } from "express";

const createAdmin = async (file: IFile, payload: any): Promise<Admin> => {
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    payload.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }
  console.log(payload);
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);
  const userData = {
    email: payload.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: payload.admin,
    });
    return createdAdminData;
  });

  return result;
};

const createDoctor = async (file: IFile, payload: any): Promise<Doctor> => {
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    payload.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }
  console.log(payload);
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);
  const userData = {
    email: payload.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.doctor.create({
      data: payload.doctor,
    });
    return createdAdminData;
  });

  return result;
};

const createPatient = async (file: IFile, payload: any): Promise<Patient> => {
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    payload.patient.profilePhoto = uploadToCloudinary?.secure_url;
  }
  console.log(payload);
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);
  const userData = {
    email: payload.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.patient.create({
      data: payload.patient,
    });
    return createdAdminData;
  });

  return result;
};

const getAllUsers = async (query: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = query;
  const andConditions: Prisma.UserWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput = {
    AND: andConditions,
  };
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      needsPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      doctor: true,
      patient: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const changeProfileStatus = async (
  id: string,
  payload: { status: UserStatus }
) => {
  const userData = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (userData === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid User");
  }

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });
  console.log(updateUserStatus);

  return updateUserStatus;
};

const getProfileInfo = async (user: IAuthUser | null) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      needsPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      doctor: true,
      patient: true,
    },
  });

  if (userData === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid User");
  }

  let profileInfo;

  switch (userData.role) {
    case UserRole.ADMIN:
      profileInfo = await prisma.admin.findUnique({
        where: {
          email: userData.email,
        },
      });
      break;
    case UserRole.DOCTOR:
      profileInfo = await prisma.doctor.findUnique({
        where: {
          email: userData.email,
        },
      });
      break;
    case UserRole.PATIENT:
      profileInfo = await prisma.patient.findUnique({
        where: {
          email: userData.email,
        },
      });
      break;
  }

  return {...userData};
};

const updateProfileInfo = async(user: IAuthUser | null, req: Request) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    }
  });

  if (userData === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid User");
  }

  if (req.file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(req.file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  let profileInfo;

  switch (userData.role) {
    case UserRole.ADMIN:
      profileInfo = await prisma.admin.update({
        where: {
          email: userData.email,
        },
        data: req.body
      });
      break;
    case UserRole.DOCTOR:
      profileInfo = await prisma.doctor.update({
        where: {
          email: userData.email,
        },
        data: req.body
      });
      break;
    case UserRole.PATIENT:
      profileInfo = await prisma.patient.update({
        where: {
          email: userData.email,
        },
        data: req.body
      });
      break;
  }

  return profileInfo;

}

export const UserServices = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
  changeProfileStatus,
  getProfileInfo,
  updateProfileInfo
};
