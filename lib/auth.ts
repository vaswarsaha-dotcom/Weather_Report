// lib/auth.ts  (server-only)
import { createClient } from "@/lib/supabase/server";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
};

export class AuthError extends Error {
  status: number;

  constructor(message = "Unauthorized", status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

/** Returns the logged-in Supabase user in the shape the app expects, or null. */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    return {
      id: user.id,
      email: user.email ?? "",
      name:
        (user.user_metadata?.name as string | undefined) ||
        user.email?.split("@")[0] ||
        "User",
      // app_metadata can only be changed server-side, so it is safe for roles
      role: user.app_metadata?.role === "admin" ? "admin" : "user",
    };
  } catch {
    return null;
  }
}

/** Throws AuthError(401) when nobody is logged in. */
export async function requireSession(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) throw new AuthError("Unauthorized", 401);
  return user;
}

/** Throws AuthError(401) or AuthError(403) unless the user is an admin. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireSession();
  if (user.role !== "admin") throw new AuthError("Forbidden", 403);
  return user;
}