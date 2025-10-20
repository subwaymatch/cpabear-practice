import { requireAnyRole } from "@/lib/auth-utils"
import { SimEditor } from "@/components/admin/sim-editor"

export default async function NewSimPage() {
  const session = await requireAnyRole(["admin", "editor"])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create New Simulation</h1>
        <p className="mt-2 text-muted-foreground">Create a new task-based simulation</p>
      </div>
      <SimEditor userId={session.user.id} />
    </div>
  )
}
