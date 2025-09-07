import { router, publicProcedure, authedProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hash } from "argon2";

export const appRouter = router({
  // ---------- auth ----------
  signup: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(4) }))
    .mutation(async ({ input }) => {
      const exists = await prisma.account.findUnique({
        where: { email: input.email },
      });
      if (exists) throw new Error("EMAIL_TAKEN");
      const password = await hash(input.password);
      await prisma.account.create({ data: { email: input.email, password } });
      return { ok: true };
    }),

  // ---------- cart ----------
  cart: authedProcedure.query(async ({ ctx }) => {
    const cart = await prisma.cart.findUnique({
      where: { userId: ctx.user.id },
      include: { items: true },
    });
    return cart ?? { items: [] };
  }),

  addToCart: authedProcedure
    .input(
      z.object({ productId: z.string(), qty: z.number().int().positive() })
    )
    .mutation(async ({ ctx, input }) => {
      const cart = await prisma.cart.upsert({
        where: { userId: ctx.user.id },
        create: { userId: ctx.user.id },
        update: {},
      });
      await prisma.cartItem.upsert({
        where: {
          cartId_productId: { cartId: cart.id, productId: input.productId },
        },
        create: { cartId: cart.id, productId: input.productId, qty: input.qty },
        update: { qty: { increment: input.qty } },
      });
      return { ok: true };
    }),
});

export type AppRouter = typeof appRouter;
