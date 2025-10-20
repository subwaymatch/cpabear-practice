import { auth } from "./auth"
import { db } from "./db"
import { userRole, type Role } from "./db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }
  return session
}

export async function getUserRoles(userId: string): Promise<Role[]> {
  const roles = await db.select().from(userRole).where(eq(userRole.userId, userId))

  return roles.map((r) => r.role)
}

export async function hasRole(userId: string, role: Role): Promise<boolean> {
  const roles = await getUserRoles(userId)
  return roles.includes(role)
}

export async function hasAnyRole(userId: string, roles: Role[]): Promise<boolean> {
  const userRoles = await getUserRoles(userId)
  return roles.some((role) => userRoles.includes(role))
}

export async function requireRole(role: Role) {
  const session = await requireAuth()
  const hasRequiredRole = await hasRole(session.user.id, role)

  if (!hasRequiredRole) {
    redirect("/dashboard")
  }

  return session
}

export async function requireAnyRole(roles: Role[]) {
  const session = await requireAuth()
  const hasRequiredRole = await hasAnyRole(session.user.id, roles)

  if (!hasRequiredRole) {
    redirect("/dashboard")
  }

  return session
}
