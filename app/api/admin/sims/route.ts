import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { simulation } from "@/lib/db/schema"
import { requireAnyRole } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    await requireAnyRole(["admin", "editor"])

    const data = await request.json()

    const [newSim] = await db
      .insert(simulation)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    return NextResponse.json(newSim)
  } catch (error) {
    console.error("Error creating simulation:", error)
    return NextResponse.json({ error: "Failed to create simulation" }, { status: 500 })
  }
}
