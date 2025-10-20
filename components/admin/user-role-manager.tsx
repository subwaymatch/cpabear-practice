"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Role } from "@/lib/db/schema"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const availableRoles: Role[] = ["admin", "editor", "premium", "free"]

interface UserRoleManagerProps {
  userId: string
  currentRoles: Role[]
}

export function UserRoleManager({ userId, currentRoles }: UserRoleManagerProps) {
  const router = useRouter()
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(currentRoles)
  const [isLoading, setIsLoading] = useState(false)

  const handleRoleToggle = (role: Role) => {
    setSelectedRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}/roles`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roles: selectedRoles }),
      })

      if (!response.ok) {
        throw new Error("Failed to update roles")
      }

      router.refresh()
    } catch (error) {
      console.error("Error updating roles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanges = JSON.stringify(selectedRoles.sort()) !== JSON.stringify(currentRoles.sort())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Management</CardTitle>
        <CardDescription>Assign roles to this user</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {availableRoles.map((role) => (
            <div key={role} className="flex items-center space-x-2">
              <Checkbox
                id={role}
                checked={selectedRoles.includes(role)}
                onCheckedChange={() => handleRoleToggle(role)}
              />
              <Label htmlFor={role} className="flex-1 cursor-pointer">
                <Badge variant={selectedRoles.includes(role) ? "default" : "outline"}>{role}</Badge>
              </Label>
            </div>
          ))}
        </div>
        <Button onClick={handleSave} disabled={!hasChanges || isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  )
}
