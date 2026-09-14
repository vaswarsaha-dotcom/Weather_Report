// types/user.ts
import type { Role } from "@/lib/constants";

export interface Branding {
  logoUrl: string | null;
  primaryColor: string;
  font: "fraunces" | "inter" | "system";
  radius: "sharp" | "soft" | "round";
  theme: "dark" | "light";
}

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: Role;
  branding: Branding;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  branding: Branding;
}