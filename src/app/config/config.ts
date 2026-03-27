import dotenv from "dotenv";
import { SignOptions } from "jsonwebtoken";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), ".env") });

if (!process.env.ADMIN_EMAIL) {
  throw new Error("ADMIN_EMAIL is not defined in the environment variables");
}

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    access_token_expires_in: process.env
      .ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env
      .REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
    reset_pass_secret: process.env.RESET_PASS_TOKEN,
    reset_pass_token_expires_in: process.env
      .RESET_PASS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  },
  admin: {
    username: process.env.ADMIN_USERNAME,
    email: process.env.ADMIN_EMAIL,
  },
  //Here add your other environment variables
};
