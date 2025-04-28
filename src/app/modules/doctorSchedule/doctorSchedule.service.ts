import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";
import httpStatus from "http-status";
import { IFilterRequest } from "../schedule/schedule.interface";
import { IOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma } from "../../../../generated/prisma";
import { IDoctorScheduleFilterRequest } from "./doctorSchedule.interface";

const getMyScheduleFromDB = async (
  user: IAuthUser,
  query: any,
  options: IOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { startDate, endDate, ...filterData } = query;

  const andCondition: Prisma.DoctorSchedulesWhereInput[] = [];

  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  if (filterData && Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked === true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked === false;
    }
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.doctorSchedules.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {},
  });

  const total = await prisma.schedule.count({
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

const getAllDoctorSchedulesFromDB = async (
  query: IDoctorScheduleFilterRequest,
  options: IOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = query;

  const andConditions: Prisma.DoctorSchedulesWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      doctor: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    });
  }

  if (filterData && Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked === true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked === false;
    }
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctorSchedules.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {},
    include: {
      doctor: true,
      schedule: true,
    },
  });

  const total = await prisma.schedule.count({
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

const createDoctorScheduleIntoDB = async (
  user: IAuthUser,
  payload: {
    scheduleIds: string[];
  }
) => {
  console.log(user);
  const doctorData = await prisma.doctor.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (doctorData === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });

  return result;
};

const deleteDpctorScheduleFromDB = async (
  user: IAuthUser,
  scheduleId: string
) => {
  const doctorData = await prisma.doctor.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (doctorData === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  const isBookedSchedule = await prisma.doctorSchedules.findFirst({
    where: {
      doctorId: doctorData.id,
      scheduleId: scheduleId,
      isBooked: true,
    },
  });

  if (isBookedSchedule) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can not delete the schedule because of the schedule is already booked!"
    );
  }

  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId,
      },
    },
  });

  return null;
};

export const DoctorScheduleServices = {
  getMyScheduleFromDB,
  getAllDoctorSchedulesFromDB,
  createDoctorScheduleIntoDB,
  deleteDpctorScheduleFromDB,
};
