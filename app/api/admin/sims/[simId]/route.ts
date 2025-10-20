import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { simulation } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { requireAnyRole } from "@/lib/auth-utils"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ simId: string }> }) {
  try {
    await requireAnyRole(["admin", "editor"])

    const { simId } = await params
    const data = await request.json()

    const [updatedSim] = await db
      .update(simulation)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(simulation.id, simId))
      .returning()

    return NextResponse.json(updatedSim)
  } catch (error) {
    console.error("Error updating simulation:", error)
    return NextResponse.json({ error: "Failed to update simulation" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ simId: string }> }) {
  try {
    await requireAnyRole(["admin", "editor"])

    const { simId } = await params

    await db.delete(simulation).where(eq(simulation.id, simId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting simulation:", error)
    return NextResponse.json({ error: "Failed to delete simulation" }, { status: 500 })
  }
}
