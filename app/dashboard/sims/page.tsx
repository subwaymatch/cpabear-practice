import { requireAuth } from "@/lib/auth-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardSimsPage() {
  await requireAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Task-Based Simulations</h1>
        <p className="mt-2 text-muted-foreground">Practice with realistic exam simulations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Simulation practice interface will be available in a future update</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This section will allow you to work through task-based simulations and review solutions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
