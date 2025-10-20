import { requireRole } from "@/lib/auth-utils"
import { UsersList } from "@/components/admin/users-list"

export default async function UsersPage() {
  await requireRole("admin")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="mt-2 text-muted-foreground">Manage user accounts and roles</p>
        </div>
      </div>
      <UsersList />
    </div>
  )
}
