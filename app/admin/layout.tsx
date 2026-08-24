import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/admin");
  if (session.role !== "admin") redirect("/dashboard");

  return <AdminShell userEmail={session.email}>{children}</AdminShell>;
}
