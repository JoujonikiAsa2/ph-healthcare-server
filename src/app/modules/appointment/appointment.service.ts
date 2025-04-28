import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma, UserRole, UserStatus } from "../../../../generated/prisma";
import { IFilterRequest } from "./appointment.interface";
import { IOptions } from "../../interfaces/pagination";
import { IAuthUser } from "../../interfaces/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { v4 as uuidv4 } from "uuid";

const getAllAppointmentsFromDB = async (
  user: IAuthUser,
  query: any,
  options: IOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { patientEmail, doctorEmail, ...filterData } = query;

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (patientEmail) {
    andConditions.push({
      patient: {
        email: patientEmail,
      },
    });
  } else if (doctorEmail) {
    andConditions.push({
      doctor: {
        email: doctorEmail,
      },
    });
  }

  if (filterData && Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    take: limit,
    skip,
    orderBy:
      query.sortBy && query.sortOrder
        ? { [query.sortBy]: query.sortOrder }
        : { createdAt: "desc" },
    include:
      user?.role === UserRole.PATIENT
        ? { doctor: true, schedule: true }
        : {
            patient: {
              include: { medicalReport: true, patientHealthData: true },
            },
            schedule: true,
          },
  });

  const total = await prisma.appointment.count({
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

const getMyAppointmentFromDB = async (
  user: IAuthUser,
  query: any,
  options: IOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { ...filterData } = query;

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user?.role === UserRole.PATIENT) {
    andConditions.push({
      patient: {
        email: user?.email,
      },
    });
  } else if (user?.role === UserRole.DOCTOR) {
    andConditions.push({
      doctor: {
        email: user?.email,
      },
    });
  }

  if (filterData && Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    take: limit,
    skip,
    orderBy:
      query.sortBy && query.sortOrder
        ? { [query.sortBy]: query.sortOrder }
        : { createdAt: "desc" },
    include:
      user?.role === UserRole.PATIENT
        ? { doctor: true, schedule: true }
        : {
            patient: {
              include: { medicalReport: true, patientHealthData: true },
            },
            schedule: true,
          },
  });

  const total = await prisma.appointment.count({
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
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: createdAppointment.id,
      },
    });

    const today = new Date();

    const transactionId =
      "PH-HealthCare-" +
      today.getFullYear() +
      "-" +
      today.getDay() +
      "-" +
      today.getHours() +
      "-" +
      today.getMinutes();

    await transactionClient.payment.create({
      data: {
        appointmentId: createdAppointment.id,
        transactionId,
        amount: doctorData.appoinmentFee,
      },
    });
  });

  return result;
};

const deleteAppointmentFromDB = async (appointmentId: string) => {
  console.log(appointmentId);
  const appointmentData = await prisma.appointment.findUnique({
    where: {
      id: appointmentId,
    },
  });

  if (appointmentData === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "There is no appointment exist");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.payment.delete({
      where: {
        appointmentId: appointmentData.id,
      },
    });

    await transactionClient.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: appointmentData?.doctorId as string,
          scheduleId: appointmentData?.scheduleId as string,
        },
      },
      data: {
        isBooked: false,
        appointmentId: appointmentData.id,
      },
    });

    await transactionClient.appointment.delete({
      where: {
        id: appointmentId,
      },
    });
  });
  return result;
};

export const AppointmentServices = {
  getAllAppointmentsFromDB,
  getMyAppointmentFromDB,
  createAppointment,
  deleteAppointmentFromDB,
};
