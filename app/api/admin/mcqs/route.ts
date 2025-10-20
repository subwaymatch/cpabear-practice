import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { mcq } from "@/lib/db/schema"
import { requireAnyRole } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    await requireAnyRole(["admin", "editor"])

    const data = await request.json()

    const [newMcq] = await db
      .insert(mcq)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    return NextResponse.json(newMcq)
  } catch (error) {
    console.error("Error creating MCQ:", error)
    return NextResponse.json({ error: "Failed to create MCQ" }, { status: 500 })
  }
}
