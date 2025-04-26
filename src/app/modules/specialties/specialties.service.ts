import { Request } from "express";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { IFile } from "../../interfaces/file";

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

const getSpecialties = async () => {
  const result = await prisma.specialties.findMany();
  return result;
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
