import * as bcrypt from "bcrypt";
import config from "../config/config";
import { prisma } from "../lib/prisma";

export const seedAdmin = async () => {
  try {
    const isExistAdmin = await prisma.auth.findFirst({
      where: {
        username: config.admin.username,
      },
    });

    if (isExistAdmin) {
      console.log("admin is live now!");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      config.admin.username as string,
      12,
    );

    const adminData = {
      email: config.admin.email as string,
      password: hashedPassword,
      username: config.admin.username as string,
    };

    if (!isExistAdmin) {
      const admin = await prisma.auth.create({
        data: adminData,
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return admin;
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};
