import { db } from "@/lib/db"
import { user, userRole } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit } from "lucide-react"

export async function UsersList() {
  // Fetch all users with their roles
  const users = await db.select().from(user).orderBy(user.createdAt)

  // Fetch roles for all users
  const usersWithRoles = await Promise.all(
    users.map(async (u) => {
      const roles = await db.select().from(userRole).where(eq(userRole.userId, u.id))
      return {
        ...u,
        roles: roles.map((r) => r.role),
      }
    }),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users ({usersWithRoles.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {usersWithRoles.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">No users found</p>
          ) : (
            <div className="space-y-3">
              {usersWithRoles.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-foreground">{u.name}</p>
                        <p className="text-sm text-muted-foreground">@{u.username}</p>
                        {u.email && <p className="text-xs text-muted-foreground">{u.email}</p>}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {u.roles.length > 0 ? (
                        u.roles.map((role) => (
                          <Badge key={role} variant="secondary">
                            {role}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">No roles</Badge>
                      )}
                    </div>
                  </div>
                  <Link href={`/admin/users/${u.id}`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
