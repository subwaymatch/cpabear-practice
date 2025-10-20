import { requireAuth } from "@/lib/auth-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardProgressPage() {
  await requireAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Progress Tracking</h1>
        <p className="mt-2 text-muted-foreground">Monitor your performance and improvement</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Detailed progress analytics will be available in a future update</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This section will include charts, performance metrics, and personalized recommendations.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
