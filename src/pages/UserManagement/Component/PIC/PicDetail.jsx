import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PicDetail({ pic, onClose, clients = [], projects = [] }) {
  if (!pic) return null

  const getClientName = (id) => {
    const client = clients.find((c) => c.id == id)
    return client?.name || "Not assigned"
  }
  
  const getProjectName = (id) => {
    const project = projects.find((p) => p.id == id)
    
    // Jika tidak ditemukan, beri pesan error
    if (id && !project) {
      return `Project ID ${id} (Not Found in Database)`
    }
    
    return project?.name || "Not assigned"
  }

  // Cek apakah project_id valid
  const hasInvalidProject = pic.project_id && !projects.find(p => p.id == pic.project_id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">PIC Detail</h2>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="flex items-center gap-1">
            ← Back to PIC List
          </Button>
        )}
      </div>

      {hasInvalidProject && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Warning: This PIC is assigned to Project ID {pic.project_id} which doesn't exist in the database.
            Please update the PIC assignment.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{pic.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong className="block text-sm text-muted-foreground">Title / Role</strong>
              <span>{pic.title || "-"}</span>
            </div>
            <div>
              <strong className="block text-sm text-muted-foreground">Phone</strong>
              <span>{pic.phone || "-"}</span>
            </div>
            <div>
              <strong className="block text-sm text-muted-foreground">Email</strong>
              <span>{pic.email || "-"}</span>
            </div>
            <div>
              <strong className="block text-sm text-muted-foreground">For Client</strong>
              <span>{getClientName(pic.client_id)}</span>
            </div>
            <div>
              <strong className="block text-sm text-muted-foreground">For Project</strong>
              <span>{getProjectName(pic.project_id)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}