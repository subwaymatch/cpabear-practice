import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, FileText, BarChart } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/db"
import { user, mcq, simulation } from "@/lib/db/schema"
import { count } from "drizzle-orm"

export async function AdminDashboard() {
  // Fetch statistics
  const [userCount] = await db.select({ count: count() }).from(user)
  const [mcqCount] = await db.select({ count: count() }).from(mcq)
  const [simCount] = await db.select({ count: count() }).from(simulation)

  const stats = [
    {
      title: "Total Users",
      value: userCount.count,
      icon: Users,
      href: "/admin/users",
      description: "Manage user accounts",
    },
    {
      title: "MCQ Questions",
      value: mcqCount.count,
      icon: BookOpen,
      href: "/admin/mcqs",
      description: "Manage MCQ questions",
    },
    {
      title: "Simulations",
      value: simCount.count,
      icon: FileText,
      href: "/admin/sims",
      description: "Manage TBS questions",
    },
    {
      title: "Analytics",
      value: "View",
      icon: BarChart,
      href: "/admin/analytics",
      description: "View platform analytics",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Manage your CPA exam platform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="transition-colors hover:bg-accent">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/admin/mcqs/new"
              className="flex items-center gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
            >
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-medium">Create New MCQ</span>
            </Link>
            <Link
              href="/admin/sims/new"
              className="flex items-center gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
            >
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium">Create New Simulation</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
            >
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium">Manage Users</span>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent activity to display</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
