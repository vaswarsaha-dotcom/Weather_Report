// app/admin/users/page.tsx
import { UsersTable } from "@/components/admin/UsersTable";

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-xl font-bold text-cloud">Users</h1>
      <UsersTable />
    </div>
  );
}