import * as bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../config/config";
import APIError from "../../errors/APIError";
import { prisma } from "../../lib/prisma";
import { comparePasswords } from "../../utils/comparePassword";
import { hashedPassword } from "../../utils/hashedPassword";
import { jwtHelpers } from "../../utils/jwtHelpers";
import { IChangePassword } from "./auth.interface";

const loginUser = async (payload: { identifier: string; password: string }) => {
  let userData = await prisma.auth.findUnique({
    where: {
      email: payload.identifier,
    },
  });

  if (!userData) {
    userData = await prisma.auth.findUnique({
      where: {
        username: payload.identifier,
      },
    });
  }

  if (!userData) {
    throw new APIError(httpStatus.NOT_FOUND, "User not found!");
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password,
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      username: userData.username,
      userId: userData.id,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in as string,
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      username: userData.username,
      userId: userData.id,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    userData,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret,
    );
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  const userData = await prisma.auth.findUniqueOrThrow({
    where: {
      email: decodedData.email,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in as string,
  );

  return {
    accessToken,
  };
};

const changePassword = async (userId: string, payload: IChangePassword) => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await prisma.auth.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isUserExist) {
    throw new APIError(httpStatus.NOT_FOUND, "User does not exist");
  }

  // checking old password
  if (
    isUserExist.password &&
    !(await comparePasswords(oldPassword, isUserExist.password))
  ) {
    throw new APIError(httpStatus.UNAUTHORIZED, "Old Password is incorrect");
  }

  const hashPassword = await hashedPassword(newPassword);

  await prisma.auth.update({
    where: {
      id: isUserExist.id,
    },
    data: {
      password: hashPassword,
    },
  });
};

export const authServices = {
  loginUser,
  refreshToken,
  changePassword,
};
