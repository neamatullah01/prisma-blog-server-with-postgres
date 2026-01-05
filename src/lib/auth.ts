import { betterAuth, string } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
          to: user.email,
          subject: "Please verify your email",
          html: `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #4f46e5;
      padding: 20px;
      text-align: center;
      color: #ffffff;
    }
    .content {
      padding: 30px;
      color: #333333;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      margin: 25px 0;
      padding: 14px 28px;
      background-color: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      background-color: #f4f6f8;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #666666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Email Verification</h1>
    </div>

    <div class="content">
      <p>Hello ${user.name}</p>

      <p>
        Thank you for creating an account with us.  
        Please verify your email address by clicking the button below:
      </p>

      <p style="text-align: center;">
        <a href=${verificationUrl} class="button">
          Verify Email
        </a>
      </p>

      <p>
        If you did not create this account, you can safely ignore this email.
      </p>

      <p>
        This verification link will expire in <strong>24 hours</strong>.
      </p>

      <p>
        Regards,<br />
        <strong>Your App Team</strong>
      </p>
    </div>

    <div class="footer">
      <p>
        © 2026 Your App Name. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>

        `,
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
