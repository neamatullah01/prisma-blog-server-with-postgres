import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/verifyAuth";

async function seedAdmin() {
  try {
    const adminData = {
      name: "Admin shaheb",
      email: "admin123456@gmail.com",
      role: UserRole.ADMIN,
      password: "admin123456",
    };
    const existUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (existUser) {
      throw new Error("Already exist this user");
    }

    const signUpAdmin = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:4000",
        },
        body: JSON.stringify(adminData),
      }
    );

    console.log(signUpAdmin);
    if (signUpAdmin.ok) {
      console.log("admin created");
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
}

seedAdmin();
