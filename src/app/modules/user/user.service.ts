import { PrismaClient, UserRole } from "../../../../generated/prisma";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const createAdmin = async (payload: any) => {
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

export const UserServices = {
  createAdmin,
};
