import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit } from "lucide-react"
import { DeleteMcqButton } from "./delete-mcq-button"

interface McqListProps {
  mcqs: Array<{
    id: string
    title: string
    difficulty: string | null
    topic: string | null
    createdAt: Date
  }>
  currentPage: number
  totalPages: number
}

export function McqList({ mcqs, currentPage, totalPages }: McqListProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>All MCQs ({mcqs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {mcqs.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">No MCQs found. Create your first one!</p>
          ) : (
            <div className="space-y-3">
              {mcqs.map((mcq) => (
                <div
                  key={mcq.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{mcq.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {mcq.difficulty && (
                        <Badge variant="secondary" className="capitalize">
                          {mcq.difficulty}
                        </Badge>
                      )}
                      {mcq.topic && <Badge variant="outline">{mcq.topic}</Badge>}
                      <span className="text-xs text-muted-foreground">
                        {new Date(mcq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/mcqs/${mcq.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteMcqButton mcqId={mcq.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/admin/mcqs?page=${currentPage - 1}`}>
            <Button variant="outline" disabled={currentPage === 1}>
              Previous
            </Button>
          </Link>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Link href={`/admin/mcqs?page=${currentPage + 1}`}>
            <Button variant="outline" disabled={currentPage === totalPages}>
              Next
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
