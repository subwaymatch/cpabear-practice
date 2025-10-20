import { requireAnyRole } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { simulation } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { SimList } from "@/components/admin/sim-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function SimsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  await requireAnyRole(["admin", "editor"])

  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = 10
  const offset = (page - 1) * pageSize

  // Fetch simulations with pagination
  const sims = await db.select().from(simulation).orderBy(desc(simulation.createdAt)).limit(pageSize).offset(offset)

  // Get total count for pagination
  const totalSims = await db.select().from(simulation)
  const totalPages = Math.ceil(totalSims.length / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Task-Based Simulations</h1>
          <p className="mt-2 text-muted-foreground">Manage task-based simulation questions</p>
        </div>
        <Link href="/admin/sims/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Simulation
          </Button>
        </Link>
      </div>

      <SimList sims={sims} currentPage={page} totalPages={totalPages} />
    </div>
  )
}
