import { requireAnyRole } from "@/lib/auth-utils"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  await requireAnyRole(["admin", "editor"])

  return <AdminDashboard />
}
