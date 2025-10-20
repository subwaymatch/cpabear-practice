import { requireAnyRole } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { simulation } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { SimEditor } from "@/components/admin/sim-editor"

export default async function EditSimPage({ params }: { params: Promise<{ simId: string }> }) {
  const session = await requireAnyRole(["admin", "editor"])
  const { simId } = await params

  const [simData] = await db.select().from(simulation).where(eq(simulation.id, simId))

  if (!simData) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Simulation</h1>
        <p className="mt-2 text-muted-foreground">Update the task-based simulation</p>
      </div>
      <SimEditor userId={session.user.id} sim={simData} />
    </div>
  )
}
