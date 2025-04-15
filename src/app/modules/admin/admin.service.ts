import { Admin, Prisma, PrismaClient, UserStatus } from "../../../../generated/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { adminSearchableFields } from "./admin.constant";

const getAllAdminsFromDB = async (query: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = query;
  const andConditions: Prisma.AdminWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => ({
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
          equals: filterData[key],
        },
      })),
    });
  }
  console.dir(andConditions, { depth: "infinity" });

  const whereConditions: Prisma.AdminWhereInput = {
    AND: andConditions,
  };
  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
  });

  const total = await prisma.admin.count({
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

const getAdminByIdFromDB = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateAdminIntoDB = async (
  id: string,
  payload: Partial<Admin>
): Promise<Admin> => {
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteAdminFromDB = async (id: string) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const deletedAdmin = await transactionClient.admin.delete({
      where: {
        id,
      },
    });
    await transactionClient.user.delete({
      where: {
        email: deletedAdmin.email,
      },
    });
    return deletedAdmin;
  });
  return result;
};

const softDeleteAdminFromDB = async (id: string) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const deletedAdmin = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await transactionClient.user.update({
      where: {
        email: deletedAdmin.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return deletedAdmin;
  });
  return result;
};

export const AdminServices = {
  getAllAdminsFromDB,
  getAdminByIdFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
  softDeleteAdminFromDB
};
