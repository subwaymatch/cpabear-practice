import type React from "react"
import { requireAnyRole } from "@/lib/auth-utils"
import { AdminNav } from "@/components/admin/admin-nav"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAnyRole(["admin", "editor"])

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={session.user} />
      <div className="flex">
        <AdminNav />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
