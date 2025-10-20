import { requireAnyRole } from "@/lib/auth-utils"
import { McqEditor } from "@/components/admin/mcq-editor"

export default async function NewMcqPage() {
  const session = await requireAnyRole(["admin", "editor"])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create New MCQ</h1>
        <p className="mt-2 text-muted-foreground">Create a new multiple-choice question</p>
      </div>
      <McqEditor userId={session.user.id} />
    </div>
  )
}
