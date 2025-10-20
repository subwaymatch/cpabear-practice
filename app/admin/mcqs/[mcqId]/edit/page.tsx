import { requireAnyRole } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { mcq } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { McqEditor } from "@/components/admin/mcq-editor"

export default async function EditMcqPage({ params }: { params: Promise<{ mcqId: string }> }) {
  const session = await requireAnyRole(["admin", "editor"])
  const { mcqId } = await params

  const [mcqData] = await db.select().from(mcq).where(eq(mcq.id, mcqId))

  if (!mcqData) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit MCQ</h1>
        <p className="mt-2 text-muted-foreground">Update the multiple-choice question</p>
      </div>
      <McqEditor userId={session.user.id} mcq={mcqData} />
    </div>
  )
}
