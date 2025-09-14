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
import { signUp } from "@/server/users"; // <-- your better-auth wrapper

/* ------------------------------------------------------------------ */
/* 1. Schema (single source of truth)                                 */
/* ------------------------------------------------------------------ */
const schema = z
  .object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid e-mail"),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        "≥ 8 chars, 1 upper, 1 lower, 1 number"
      ),
    rpassword: z.string(),
  })
  .refine((d) => d.password === d.rpassword, {
    message: "Passwords do not match",
    path: ["rpassword"],
  });

type Form = z.infer<typeof schema>;

/* ------------------------------------------------------------------ */
/* 2. Component                                                       */
/* ------------------------------------------------------------------ */
export function RegisterForm({
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
    watch,
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const password = watch("password");

  /* ------------------------------------------------------------ */
  /* 3. Submit                                                    */
  /* ------------------------------------------------------------ */
  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      try {
        await signUp(data.email, data.password, data.name); // your fn
        router.push("/dashboard"); // soft navigation
        router.refresh(); // revalidate server layouts
      } catch (err: any) {
        setError("root", { message: err.message ?? "Registration failed" });
      }
    });
  });

  /* ------------------------------------------------------------ */
  /* 4. Password-strength visual                                  */
  /* ------------------------------------------------------------ */
  const strength =
    password && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
      ? "strong"
      : password
      ? "weak"
      : "none";

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={onSubmit}
      noValidate
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your information below
        </p>
      </div>

      <div className="grid gap-6">
        {/* Name */}
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>

        {/* Repeat password */}
        <div className="grid gap-2">
          <Label htmlFor="rpassword">Repeat password</Label>
          <Input
            id="rpassword"
            type="password"
            autoComplete="new-password"
            {...register("rpassword")}
          />
          {errors.rpassword && (
            <p className="text-red-500 text-xs">{errors.rpassword.message}</p>
          )}
          <a
            href="/account/login"
            className="text-sm underline-offset-4 hover:underline text-neutral-400"
          >
            Already got an account?
          </a>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating account…" : "Register"}
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
