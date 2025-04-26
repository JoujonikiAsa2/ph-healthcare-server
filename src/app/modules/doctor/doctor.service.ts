import prisma from "../../../shared/prisma";
import { IDoctorFilterRequest, IDoctorUpdate } from "./doctor.interface";
import { IOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma } from "../../../../generated/prisma";
import { doctorSearchableFields } from "./doctor.constant";
import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const getAllDoctors = async (
  query: IDoctorFilterRequest,
  options: IOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = query;
  const doctorConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    doctorSearchableFields.forEach((field) => {
      doctorConditions.push({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      });
    });
  }

  if (Object.keys(filterData).length > 0) {
    doctorConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  // console.dir(doctorConditions, { depth: "infinity" });

  const whereConditions: Prisma.DoctorWhereInput = {
    AND: doctorConditions,
  };

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
  });

  const total = await prisma.doctor.count({
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

const uploadDoctorInfo = async (id: string, payload: IDoctorUpdate) => {
  const { specialties, ...doctorData } = payload;

  // check if doctor exist or not
  const doctorInfo = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });

  if (doctorInfo === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  await prisma.$transaction(async (transactionClient) => {
    const updatedDoctor = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });


    if (specialties && specialties.length > 0) {
      const deletedSpecialities = specialties.filter(
        (speciality) => speciality.isDeleted
      );
      for (const speciality of deletedSpecialities) {
        await transactionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialtiesId: speciality.specialtiesId,
          },
        });
      }
    }

    const createSpecialties = specialties.filter(
      (speciality) => !speciality.isDeleted
    );

    console.log(createSpecialties);
    for (const speciality of createSpecialties) {
      const createdSpecialties = await transactionClient.doctorSpecialties.create({
        data: {
          doctorId: doctorInfo.id,
          specialtiesId: speciality.specialtiesId,
        },
      });
      console.log("created specialties",createdSpecialties);
    }
  });
  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorInfo.id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  return result;
};

export const DoctorServices = {
  getAllDoctors,
  uploadDoctorInfo,
};
