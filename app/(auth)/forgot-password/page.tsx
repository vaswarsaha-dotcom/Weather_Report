"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validation";
import { GlassCard } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setFormError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Something went wrong");
      setSent(true);
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  return (
    <GlassCard className="p-8">
      <h1 className="font-display text-2xl font-medium text-cloud">Reset your password</h1>
      <p className="mt-1 text-sm text-slate">We&apos;ll email you a link to get back in.</p>

      {sent ? (
        <p className="mt-6 rounded-lg border border-cyan/30 bg-cyan/10 p-4 text-sm text-cloud">
          If an account exists for that email, a reset link is on its way. Check your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          {formError && (
            <p role="alert" className="text-sm text-red-400">
              {formError}
            </p>
          )}
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Send reset link
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate">
        <Link href="/login" className="text-cyan hover:underline">
          Back to log in
        </Link>
      </p>
    </GlassCard>
  );
}
