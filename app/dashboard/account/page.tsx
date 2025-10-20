import { requireAuth, getUserRoles } from "@/lib/auth-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

export default async function AccountPage() {
  const session = await requireAuth()
  const roles = await getUserRoles(session.user.id)

  const initials = session.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account information and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={session.user.image || undefined} alt={session.user.name} />
                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">{session.user.name}</p>
                <p className="text-sm text-muted-foreground">@{session.user.username}</p>
              </div>
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <p className="text-sm">{session.user.email || "Not provided"}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
                <p className="text-xs font-mono">{session.user.id}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                <p className="text-sm">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Roles</CardTitle>
            <CardDescription>Your access levels and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {roles.length > 0 ? (
                roles.map((role) => (
                  <div key={role} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <Badge variant="secondary" className="capitalize">
                      {role}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {role === "admin"
                        ? "Full platform access"
                        : role === "editor"
                          ? "Content management"
                          : role === "premium"
                            ? "Premium features"
                            : "Basic access"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No roles assigned</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your password and security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Password management and additional security features will be available in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
