import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verify } from "argon2";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (cred) => {
        const { email, password } = loginSchema.parse(cred);
        const user = await prisma.account.findUnique({ where: { email } });
        console.log("auth debug", { email, userFound: !!user }); // <-- NEW
        if (!user) return null;
        const ok = await verify(user.password, password);
        console.log("hash ok", ok); // <-- NEW
        return ok ? { id: user.id, email: user.email, role: user.role } : null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt: ({ token, user }) => (user ? { ...token, role: user.role } : token),
    session: ({ session, token }) => ({
      ...session,
      user: { ...session.user, role: token.role },
    }),
  },
  pages: { signIn: "/account/login" },
});

export { handler as GET, handler as POST };
