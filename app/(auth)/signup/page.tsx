// app/(auth)/signup/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await signup(email, password, name);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  return (
    <GlassCard>
      <h1 className="font-display text-xl font-bold text-cloud mb-1">Create an account</h1>
      <p className="text-sm text-slate mb-6">Free to start — no card required.</p>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <Button type="submit" loading={loading} className="w-full mt-2">Create account</Button>
      </form>
      <p className="text-xs text-slate mt-5 text-center">Already have an account? <Link href="/login" className="text-amber">Sign in</Link></p>
    </GlassCard>
  );
}