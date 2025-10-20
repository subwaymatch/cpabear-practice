import { requireAnyRole } from "@/lib/auth-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AnalyticsPage() {
  await requireAnyRole(["admin", "editor"])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="mt-2 text-muted-foreground">Platform usage and performance metrics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Analytics dashboard will be available in a future update</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This section will include user engagement metrics, question performance, and other insights.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
