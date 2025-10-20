import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit, Clock } from "lucide-react"
import { DeleteSimButton } from "./delete-sim-button"

interface SimListProps {
  sims: Array<{
    id: string
    title: string
    difficulty: string | null
    topic: string | null
    estimatedTime: number | null
    createdAt: Date
  }>
  currentPage: number
  totalPages: number
}

export function SimList({ sims, currentPage, totalPages }: SimListProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>All Simulations ({sims.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sims.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">No simulations found. Create your first one!</p>
          ) : (
            <div className="space-y-3">
              {sims.map((sim) => (
                <div
                  key={sim.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{sim.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {sim.difficulty && (
                        <Badge variant="secondary" className="capitalize">
                          {sim.difficulty}
                        </Badge>
                      )}
                      {sim.topic && <Badge variant="outline">{sim.topic}</Badge>}
                      {sim.estimatedTime && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {sim.estimatedTime} min
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(sim.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/sims/${sim.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteSimButton simId={sim.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/admin/sims?page=${currentPage - 1}`}>
            <Button variant="outline" disabled={currentPage === 1}>
              Previous
            </Button>
          </Link>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Link href={`/admin/sims?page=${currentPage + 1}`}>
            <Button variant="outline" disabled={currentPage === totalPages}>
              Next
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
