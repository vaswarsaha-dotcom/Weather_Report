// lib/auth.ts
import "server-only";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/constants";
import type { PublicUser, UserRecord } from "@/types/user";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not set — check your .env.local");

interface SessionPayload { sub: string; role: string; email: string; }

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN as any) || "7d" });
}
export function verifySession(token: string): SessionPayload | null {
  try { return jwt.verify(token, JWT_SECRET) as SessionPayload; }
  catch { return null; }
}
export async function setSessionCookie(payload: SessionPayload) {
  const token = signSession(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: SESSION_MAX_AGE_SECONDS,
  });
}
export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}

function toPublicUser(row: any): PublicUser {
  return { id: row.id, email: row.email, name: row.name, role: row.role, branding: row.branding };
}

export async function getSession(): Promise<PublicUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifySession(token);
  if (!payload) return null;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("users").select("id, email, name, role, branding").eq("id", payload.sub).single();
  if (error || !data) return null;
  return toPublicUser(data);
}

export async function requireSession(): Promise<PublicUser> {
  const user = await getSession();
  if (!user) throw new AuthError("Not authenticated", 401);
  return user;
}
export async function requireAdmin(): Promise<PublicUser> {
  const user = await requireSession();
  if (user.role !== "admin") throw new AuthError("Admin access required", 403);
  return user;
}
export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("users").select("id, email, name, password_hash, role, branding, created_at")
    .eq("email", email.toLowerCase().trim()).maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id, email: data.email, name: data.name, passwordHash: data.password_hash,
    role: data.role, branding: data.branding, createdAt: data.created_at,
  };
}