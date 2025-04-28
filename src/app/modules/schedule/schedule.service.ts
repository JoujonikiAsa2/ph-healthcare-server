import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma } from "../../../../generated/prisma";
import { IFilterRequest } from "./schedule.interface";
import { IOptions } from "../../interfaces/pagination";
import { IAuthUser } from "../../interfaces/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const getAllSchedulesFromDB = async (
  query: IFilterRequest,
  options: IOptions,
  user: IAuthUser
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { startDate, endDate, ...filterData } = query;
  console.log(startDate, endDate);

  const andCondition: Prisma.ScheduleWhereInput[] = [];

  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          startDateTime: {
            gte: startDate,
          },
        },
        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
    });
  }

  if (filterData && Object.keys(filterData).length > 0) {
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

  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user?.email,
      },
    },
  });

  const doctorScheduleIds = doctorSchedules.map(
    (schedule) => schedule.scheduleId
  );

  const result = await prisma.schedule.findMany({
    where: { ...whereConditions, id: { notIn: doctorScheduleIds } },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "asc" },
  });

  const total = await prisma.schedule.count({
    where: { ...whereConditions, id: { notIn: doctorScheduleIds } },
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

const getScheduleByIDFromDB = async (scheduleId: string) => {
  const result = await prisma.schedule.findUnique({
    where: {
      id: scheduleId,
    },
  });

  if (result === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "Schedule not found");
  }

  return result;
};

const createScheduleSlot = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const interverlTime = 30;

  const schedules = [];

  const currentDate = new Date(startDate); // start date
  const lastDate = new Date(endDate); // end date

  while (currentDate <= lastDate) {
    // 09:30  ---> ['09', '30']
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, interverlTime),
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + interverlTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

const deleteScheduleFromDB = async (scheduleId: string) => {
  const result = await prisma.schedule.delete({
      where:{
        id: scheduleId
      }
    })
    
  return result
};

export const ShceduleServices = {
  getAllSchedulesFromDB,
  getScheduleByIDFromDB,
  createScheduleSlot,
  deleteScheduleFromDB,
};
