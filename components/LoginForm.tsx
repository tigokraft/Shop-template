"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "@/server/users"; // <-- your better-auth wrapper

/* ------------------------------------------------------------------ */
/* 1. Schema                                                          */
/* ------------------------------------------------------------------ */
const schema = z.object({
  email: z.string().email("Invalid e-mail"),
  password: z.string().min(1, "Password required"),
});

type Form = z.infer<typeof schema>;

/* ------------------------------------------------------------------ */
/* 2. Component                                                       */
/* ------------------------------------------------------------------ */
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      try {
        await signIn(data.email, data.password); // your fn
        router.push("/dashboard"); // soft navigation
        router.refresh(); // revalidate server layouts
      } catch (err: any) {
        setError("root", { message: err.message ?? "Login failed" });
      }
    });
  });

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={onSubmit}
      noValidate
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>

      <div className="grid gap-6">
        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
          <a
            href="/account/register"
            className="text-sm underline-offset-4 hover:underline text-neutral-400"
          >
            Don&apos;t have an account?
          </a>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </Button>

        {/* aria-live region for async errors */}
        {errors.root && (
          <p className="text-red-500 text-center text-sm" aria-live="polite">
            {errors.root.message}
          </p>
        )}
      </div>
    </form>
  );
}
