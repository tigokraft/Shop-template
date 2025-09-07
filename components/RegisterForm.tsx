"use client";

import { trpc } from "@/utils/trpc";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const signup = trpc.signup.useMutation({
    onError: (err) => setError(err.message),
    onSuccess: () => {
      // auto-sign-in after successful register
      signIn("credentials", { email, password, redirect: false }).then(() =>
        router.push("/")
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    signup.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full input"
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full input"
      />
      <button type="submit" className="w-full btn">
        Create account
      </button>
    </form>
  );
}
