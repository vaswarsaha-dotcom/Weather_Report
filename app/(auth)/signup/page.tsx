"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { signupSchema, type SignupInput } from "@/lib/validation";
import { useAuth } from "@/hooks/useAuth";
import { GlassCard } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupInput) => {
    setFormError(null);
    try {
      await signup(data.name, data.email, data.password);
      router.push("/dashboard");
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  return (
    <GlassCard className="p-8">
      <h1 className="font-display text-2xl font-medium text-cloud">Create your account</h1>
      <p className="mt-1 text-sm text-slate">Free forever on the Starter plan.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <Input label="Full name" autoComplete="name" error={errors.name?.message} {...register("name")} />
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        {formError && (
          <p role="alert" className="text-sm text-red-400">
            {formError}
          </p>
        )}

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate">
        Already have an account?{" "}
        <Link href="/login" className="text-cyan hover:underline">
          Log in
        </Link>
      </p>
    </GlassCard>
  );
}
