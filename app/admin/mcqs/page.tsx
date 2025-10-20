import { requireAnyRole } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { mcq } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { McqList } from "@/components/admin/mcq-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function McqsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  await requireAnyRole(["admin", "editor"])

  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = 10
  const offset = (page - 1) * pageSize

  // Fetch MCQs with pagination
  const mcqs = await db.select().from(mcq).orderBy(desc(mcq.createdAt)).limit(pageSize).offset(offset)

  // Get total count for pagination
  const totalMcqs = await db.select().from(mcq)
  const totalPages = Math.ceil(totalMcqs.length / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">MCQ Questions</h1>
          <p className="mt-2 text-muted-foreground">Manage multiple-choice questions</p>
        </div>
        <Link href="/admin/mcqs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create MCQ
          </Button>
        </Link>
      </div>

      <McqList mcqs={mcqs} currentPage={page} totalPages={totalPages} />
    </div>
  )
}
