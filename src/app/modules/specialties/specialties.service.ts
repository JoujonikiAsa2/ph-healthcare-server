import { Request } from "express";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { IFile } from "../../interfaces/file";
import { ISpecialtiesFilterRequest } from "./specialties.interface";
import { IOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma } from "../../../../generated/prisma";
import { specialtiesSearchableFields } from "./specialties.constant";

const createSpecialties = async (req: Request) => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  // Use either uploaded file URL or icon from request body
  const result = await prisma.specialties.create({
    data: {
      title: req.body.title,
      icon: req.body.icon,
    },
  });

  return result;
};

const getSpecialties = async (
  filters: ISpecialtiesFilterRequest,
  options: IOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const specialtiesConditions: Prisma.SpecialtiesWhereInput[] = [];

  if (searchTerm) {
    specialtiesSearchableFields.forEach((field) =>
      specialtiesConditions.push({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })
    );
  }

  if (filterData && Object.keys(filterData).length > 0) {
    specialtiesConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
          mode: "insensitive",
        },
      })),
    });
  }

  const whereConditions: Prisma.SpecialtiesWhereInput = {
    AND: specialtiesConditions,
  };

  const result = await prisma.specialties.findMany({
    where: whereConditions,
    take: limit,
    skip,
    orderBy: options.sortBy
      ? {
          [options.sortBy]: options.sortOrder,
        }
      : {
          title: "asc",
        },
  });

  const total = await prisma.specialties.count({
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

const deleteSpecialties = async (id: string) => {
  const isExist = await prisma.specialties.findUnique({
    where: {
      id,
    },
  });
  if (!isExist) {
    throw new Error("Specialties not found");
  }
  await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return null;
};

export const SpecialtiesServices = {
  createSpecialties,
  getSpecialties,
  deleteSpecialties,
};
