import { Patient, Prisma } from "../../../../generated/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IOptions } from "../../interfaces/pagination";
import { patientSearchableFields } from "./patient.constant";
import { IPatientFilterRequest, IPatientUpdate } from "./patient.interface";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const getAllPatientsFromDB = async (
  query: IPatientFilterRequest,
  options: IOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = query;
  const andConditions: Prisma.PatientWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (filterData && Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
          mode: "insensitive",
        },
      })),
    });
  }

  const whereConditions: Prisma.PatientWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.patient.findMany({
    where: whereConditions,
    take: limit,
    skip,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });

  const total = await prisma.patient.count({
    where: whereConditions,
  });

  return {
    meta: { total, page, limit },
    data: result,
  };
};

const updatePatiendDataIntoDB = async (
  id: string,
  payload: Partial<IPatientUpdate>
): Promise<Patient | null> => {
  const { patientHealthData, medicalReport, ...patientData } = payload;
  const patientInfo = await prisma.patient.findUnique({
    where: {
      id,
    },
  });

  console.log(patientData, patientHealthData, medicalReport);

  if (patientInfo === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient Not Found");
  }

  await prisma.$transaction(async (transactionClient) => {
    await transactionClient.patient.update({
      where: {
        id,
      },
      data: patientData,
      include: {
        patientHealthData: true,
        medicalReport: true,
      },
    });

    if (patientHealthData) {
      await transactionClient.patientHealthData.upsert({
        where: {
          patientId: patientInfo.id,
        },
        create: {
          ...patientHealthData,
          patientId: patientInfo.id,
        },
        update: patientHealthData,
      });
    }
    if (medicalReport) {
      await transactionClient.medicalReport.create({
        data: { ...medicalReport, patientId: patientInfo.id },
      });
    }
  });

  const responseData = await prisma.patient.findUnique({
    where: {
      id: patientInfo.id,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });
  return responseData;
};

const deletePatientDataFromDB = async (id: string) => {
  const patientInfo = await prisma.patient.findUnique({
    where: {
      id,
    },
  });

  if (patientInfo === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient Not Found");
  }

  await prisma.$transaction(async (transactionClient) => {
    await transactionClient.patientHealthData.delete({
      where: {
        patientId: patientInfo.id,
      },
    });

    await transactionClient.medicalReport.deleteMany({
      where: {
        patientId: patientInfo.id,
      },
    });
    const deletedPatient = await transactionClient.patient.delete({
      where: {
        id: patientInfo.id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: deletedPatient.email,
      },
    });
  });
  return null;
};

export const PatientServices = {
  getAllPatientsFromDB,
  updatePatiendDataIntoDB,
  deletePatientDataFromDB,
};
