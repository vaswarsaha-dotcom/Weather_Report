// app/admin/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login?redirect=/admin");
  if (user.role !== "admin") redirect("/dashboard");
  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}