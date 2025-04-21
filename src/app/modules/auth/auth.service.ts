import { UserStatus } from "../../../../generated/prisma";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../config";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (userData === null) {
    throw new Error("No user found");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    userData.password
  );
  console.log(isPasswordMatched);
  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needsPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(token, "047dsfcdghfdkgj");
  } catch (error) {
    throw new Error("You are not authorized!");
  }

  const userData = await prisma.user.findUnique({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (userData === null) {
    throw new Error("No user found");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: userData?.needsPasswordChange,
  };
};

export const AuthServices = { loginUser, refreshToken };
