import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma, UserStatus } from "../../../../generated/prisma";
import { IFilterRequest } from "./appointment.interface";
import { IOptions } from "../../interfaces/pagination";
import { IAuthUser } from "../../interfaces/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { v4 as uuidv4 } from "uuid";

const getAllAppointmentsFromDB = async (
  query: IFilterRequest,
  options: IOptions,
  user: IAuthUser
) => {
  // const { page, limit, skip } = paginationHelper.calculatePagination(options);
  // const { startDate, endDate, ...filterData } = query;
  // console.log(startDate, endDate);
  // const andCondition: Prisma.ScheduleWhereInput[] = [];
  // if (startDate && endDate) {
  //   andCondition.push({
  //     AND: [
  //       {
  //         startDateTime: {
  //           gte: startDate,
  //         },
  //       },
  //       {
  //         endDateTime: {
  //           lte: endDate,
  //         },
  //       },
  //     ],
  //   });
  // }
  // if (filterData && Object.keys(filterData).length > 0) {
  //   andCondition.push({
  //     AND: Object.keys(filterData).map((key) => ({
  //       [key]: {
  //         equals: (filterData as any)[key],
  //       },
  //     })),
  //   });
  // }
  // const whereConditions: Prisma.ScheduleWhereInput =
  //   andCondition.length > 0 ? { AND: andCondition } : {};
  // const doctorSchedules = await prisma.doctorSchedules.findMany({
  //   where: {
  //     doctor: {
  //       email: user?.email,
  //     },
  //   },
  // });
  // const doctorScheduleIds = doctorSchedules.map(
  //   (schedule) => schedule.scheduleId
  // );
  // const result = await prisma.schedule.findMany({
  //   where: { ...whereConditions, id: { notIn: doctorScheduleIds } },
  //   skip,
  //   take: limit,
  //   orderBy:
  //     options.sortBy && options.sortOrder
  //       ? { [options.sortBy]: options.sortOrder }
  //       : { createdAt: "asc" },
  // });
  // const total = await prisma.schedule.count({
  //   where: { ...whereConditions, id: { notIn: doctorScheduleIds } },
  // });
  // return {
  //   meta: {
  //     total,
  //     page,
  //     limit,
  //   },
  //   data: result,
  // };
};

const getAppointmentByIDFromDB = async (appointmentId: string) => {
  // const result = await prisma.appointment.findUnique({
  //   where: {
  //     id: appointmentId,
  //   },
  // });
  // if (result === null) {
  //   throw new ApiError(httpStatus.NOT_FOUND, "Appointment not found");
  // }
  // return result;
};

const createAppointment = async (user: IAuthUser, payload: any) => {
  const patientData = await prisma.patient.findUnique({
    where: {
      email: user?.email,
      isDeleted: false,
    },
  });

  if (patientData === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient not found");
  }
  const doctorData = await prisma.doctor.findUnique({
    where: {
      id: payload.doctorId,
    },
  });

  if (doctorData === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  const doctorScheduleData = await prisma.doctorSchedules.findFirst({
    where: {
      doctorId: payload.doctorId,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  if (doctorScheduleData === null) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Schedule not exist or already booked"
    );
  }

  const videoCallingId = await uuidv4();

 const result = await prisma.$transaction(async (transactionClient) => {
    const createdAppointment = await transactionClient.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId: videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    await transactionClient.doctorSchedules.update({
      where:{
        doctorId_scheduleId:{
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId
        }
      },
      data: {
        isBooked: true,
        appointmentId: createdAppointment.id
      }
    })
  });

  return result
};

const deleteAppointmentFromDB = async (appointmentId: string) => {
  // const result = await prisma.appointment.delete({
  //     where:{
  //       id: appointmentId
  //     }
  //   })
  // return result
};

export const AppointmentServices = {
  getAllAppointmentsFromDB,
  getAppointmentByIDFromDB,
  createAppointment,
  deleteAppointmentFromDB,
};
