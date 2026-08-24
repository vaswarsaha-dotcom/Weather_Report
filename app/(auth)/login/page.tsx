"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { loginSchema, type LoginInput } from "@/lib/validation";
import { useAuth } from "@/hooks/useAuth";
import { GlassCard } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <Suspense fallback={<GlassCard className="h-[420px] animate-pulse p-8" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setFormError(null);
    try {
      await login(data.email, data.password);
      router.push(searchParams.get("redirect") || "/dashboard");
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  return (
    <GlassCard className="p-8">
      <h1 className="font-display text-2xl font-medium text-cloud">Welcome back</h1>
      <p className="mt-1 text-sm text-slate">Log in to your dashboard.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        {formError && (
          <p role="alert" className="text-sm text-red-400">
            {formError}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="text-cyan hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-cyan hover:underline">
          Sign up
        </Link>
      </p>
    </GlassCard>
  );
}
