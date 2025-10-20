import { requireRole } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { user, userRole } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { UserRoleManager } from "@/components/admin/user-role-manager"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function UserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  await requireRole("admin")
  const { userId } = await params

  // Fetch user details
  const [userData] = await db.select().from(user).where(eq(user.id, userId))

  if (!userData) {
    notFound()
  }

  // Fetch user roles
  const roles = await db.select().from(userRole).where(eq(userRole.userId, userId))

  const initials = userData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Basic user details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userData.image || undefined} alt={userData.name} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">{userData.name}</p>
                <p className="text-sm text-muted-foreground">@{userData.username}</p>
              </div>
            </div>
            <div className="space-y-2 border-t border-border pt-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{userData.email || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                <p className="text-xs font-mono">{userData.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Joined</p>
                <p className="text-sm">{new Date(userData.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <UserRoleManager userId={userId} currentRoles={roles.map((r) => r.role)} />
      </div>
    </div>
  )
}
