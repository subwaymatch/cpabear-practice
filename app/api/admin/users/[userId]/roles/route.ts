import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { userRole, type Role } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { requireRole } from "@/lib/auth-utils"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    // Verify admin role
    await requireRole("admin")

    const { userId } = await params
    const { roles } = (await request.json()) as { roles: Role[] }

    // Delete existing roles
    await db.delete(userRole).where(eq(userRole.userId, userId))

    // Insert new roles
    if (roles.length > 0) {
      await db.insert(userRole).values(roles.map((role) => ({ userId, role })))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user roles:", error)
    return NextResponse.json({ error: "Failed to update roles" }, { status: 500 })
  }
}
