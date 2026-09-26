// lib/auth.ts
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

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

const DEMO_COOKIE = "weathersphere-demo";

export async function getSession(): Promise<SessionUser | null> {
  /*
   * Development-only demo session.
   */
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.DEMO_LOGIN === "true"
  ) {
    const cookieStore = await cookies();
    const demoEmail = cookieStore.get(DEMO_COOKIE)?.value;

    if (demoEmail) {
      return {
        id: "demo-user",
        email: decodeURIComponent(demoEmail),
        name:
          decodeURIComponent(demoEmail).split("@")[0] ||
          "Demo User",
        role: "user",
      };
    }
  }

  /*
   * Normal Supabase session.
   */
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
      role:
        user.app_metadata?.role === "admin"
          ? "admin"
          : "user",
    };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<SessionUser> {
  const user = await getSession();

  if (!user) {
    throw new AuthError("Unauthorized", 401);
  }

  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireSession();

  if (user.role !== "admin") {
    throw new AuthError("Forbidden", 403);
  }

  return user;
}