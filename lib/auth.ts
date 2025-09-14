import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";

// 👇 Import your React email component
import { EmailAuth } from "@/components/emails/EmailAuth";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY); // 🔑 Make sure you have this in .env

export const auth = betterAuth({
  appName: "Vexo Shop",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 32,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      // Send the verification email
      await resend.emails.send({
        from: "VexoAuth <auth@nigga-nas.online>", // domain must be verified in Resend
        to: user.email,
        subject: "Verify your Vexo Shop account",
        react: EmailAuth({ url, user }), // 👈 pass props to your template
      });
    },
  },

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [nextCookies()],
});
