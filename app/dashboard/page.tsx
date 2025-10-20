import { requireAuth, getUserRoles } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { mcqProgress, simulationProgress, mcq, simulation } from "@/lib/db/schema"
import { eq, count, and } from "drizzle-orm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookOpen, FileText, TrendingUp, Award } from "lucide-react"

export default async function DashboardPage() {
  const session = await requireAuth()
  const roles = await getUserRoles(session.user.id)

  // Fetch user statistics
  const [mcqAttempts] = await db
    .select({ count: count() })
    .from(mcqProgress)
    .where(eq(mcqProgress.userId, session.user.id))

  const [mcqCorrect] = await db
    .select({ count: count() })
    .from(mcqProgress)
    .where(and(eq(mcqProgress.userId, session.user.id), eq(mcqProgress.isCorrect, true)))

  const [simAttempts] = await db
    .select({ count: count() })
    .from(simulationProgress)
    .where(eq(simulationProgress.userId, session.user.id))

  const [simCompleted] = await db
    .select({ count: count() })
    .from(simulationProgress)
    .where(and(eq(simulationProgress.userId, session.user.id), eq(simulationProgress.completed, true)))

  // Calculate accuracy
  const accuracy = mcqAttempts.count > 0 ? Math.round((mcqCorrect.count / mcqAttempts.count) * 100) : 0

  // Fetch total available questions
  const [totalMcqs] = await db.select({ count: count() }).from(mcq)
  const [totalSims] = await db.select({ count: count() }).from(simulation)

  const stats = [
    {
      title: "MCQs Attempted",
      value: `${mcqAttempts.count} / ${totalMcqs.count}`,
      icon: BookOpen,
      description: "Multiple-choice questions",
    },
    {
      title: "Accuracy Rate",
      value: `${accuracy}%`,
      icon: TrendingUp,
      description: "Correct answers",
    },
    {
      title: "Simulations",
      value: `${simCompleted.count} / ${totalSims.count}`,
      icon: FileText,
      description: "Completed simulations",
    },
    {
      title: "Total Score",
      value: mcqCorrect.count + simCompleted.count,
      icon: Award,
      description: "Points earned",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {session.user.name}!</h1>
          <p className="mt-2 text-muted-foreground">Track your progress and continue your CPA exam preparation</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <Badge key={role} variant="secondary" className="capitalize">
              {role}
            </Badge>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Practice MCQs</CardTitle>
            <CardDescription>Test your knowledge with multiple-choice questions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              {totalMcqs.count} questions available across all topics
            </p>
            <Button className="w-full" disabled={totalMcqs.count === 0}>
              Start Practice
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task-Based Simulations</CardTitle>
            <CardDescription>Work through realistic exam scenarios</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              {totalSims.count} simulations available across all topics
            </p>
            <Button className="w-full" disabled={totalSims.count === 0}>
              Start Simulation
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Admin Access */}
      {(roles.includes("admin") || roles.includes("editor")) && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>You have administrative privileges</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin">
              <Button>Go to Admin Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
