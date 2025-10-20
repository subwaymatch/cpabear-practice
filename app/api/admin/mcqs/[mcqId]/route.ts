import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { mcq } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { requireAnyRole } from "@/lib/auth-utils"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ mcqId: string }> }) {
  try {
    await requireAnyRole(["admin", "editor"])

    const { mcqId } = await params
    const data = await request.json()

    const [updatedMcq] = await db
      .update(mcq)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(mcq.id, mcqId))
      .returning()

    return NextResponse.json(updatedMcq)
  } catch (error) {
    console.error("Error updating MCQ:", error)
    return NextResponse.json({ error: "Failed to update MCQ" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ mcqId: string }> }) {
  try {
    await requireAnyRole(["admin", "editor"])

    const { mcqId } = await params

    await db.delete(mcq).where(eq(mcq.id, mcqId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting MCQ:", error)
    return NextResponse.json({ error: "Failed to delete MCQ" }, { status: 500 })
  }
}
