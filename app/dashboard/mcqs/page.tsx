import { requireAuth } from "@/lib/auth-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardMcqsPage() {
  await requireAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">MCQ Practice</h1>
        <p className="mt-2 text-muted-foreground">Practice with multiple-choice questions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>MCQ practice interface will be available in a future update</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This section will allow you to practice MCQ questions, track your progress, and review explanations.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
