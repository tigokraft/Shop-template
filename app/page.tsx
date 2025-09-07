"use client";
import { trpc } from "@/utils/trpc";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const cart = trpc.cart.useQuery(undefined, { enabled: !!session });
  const add = trpc.addToCart.useMutation({ onSuccess: () => cart.refetch() });

  if (!session)
    return (
      <button onClick={() => signIn()} className="btn">
        Sign in
      </button>
    );

  return (
    <main className="p-4">
      <p>
        Logged in as {session.user.email} ({session.user.role})
      </p>
      <button onClick={() => signOut()}>Sign out</button>

      <h2 className="mt-6 font-bold">Cart</h2>
      <pre>{JSON.stringify(cart.data, null, 2)}</pre>

      <button
        onClick={() => add.mutate({ productId: "prod_123", qty: 1 })}
        className="btn"
      >
        Add fake product
      </button>
    </main>
  );
}
