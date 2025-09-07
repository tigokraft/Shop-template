import { initTRPC } from "@trpc/server";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";

const t = initTRPC.context<{ req: NextRequest }>().create();
export const router = t.router;
export const publicProcedure = t.procedure;

export const authedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const session = await getServerSession();
  if (!session?.user) throw new Error("UNAUTHORIZED");
  return next({ ctx: { ...ctx, user: session.user } });
});
