import httpStatus from "http-status";
import { jwtHelpers } from "../utils/jwtHelpers";
import config from "../config/config";
import { Secret } from "jsonwebtoken";
import APIError from "../errors/APIError";
import catchAsync from "../utils/catchAsync";
import { prisma } from "../lib/prisma";

const auth = () => {
  return catchAsync(async (req, res, next) => {
    try {
      const token = req.headers.authorization as string;

      if (!token) {
        throw new APIError(httpStatus.UNAUTHORIZED, "Unauthorized Access!");
      }

      const decodedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.access_token_secret as Secret
      );

      // Check if the user exists in the database
      const user = await prisma.auth.findUnique({
        where: { id: decodedUser.userId, email: decodedUser.email },
      });

      if (!user) {
        throw new APIError(httpStatus.UNAUTHORIZED, "Unauthorized Access!");
      }
      // Check if the token is expired
      const tokenExpirationDate = new Date((decodedUser.exp as number) * 1000);
      if (tokenExpirationDate < new Date()) {
        throw new APIError(httpStatus.UNAUTHORIZED, "Unauthorized Access!!");
      }

      req.user = decodedUser;

      if (
        decodedUser.username == `"${config.admin.username}"` ||
        decodedUser.email == `"${config.admin.email}"`
      ) {
        throw new APIError(httpStatus.FORBIDDEN, "Forbidden!");
      }
      next();
    } catch (err) {
      next(err);
    }
  });
};

export default auth;
