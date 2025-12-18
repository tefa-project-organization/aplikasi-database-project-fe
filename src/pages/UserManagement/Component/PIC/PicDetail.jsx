// src/pages/UserManagement/Component/PIC/PicDetail.jsx
import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PicDetail({ pic, onClose }) {
  if (!pic) return null

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">PIC Detail</h2>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex items-center gap-1"
          >
            ← Back to PIC List
          </Button>
        )}
      </div>

      {/* MAIN INFO */}
      <Card>
        <CardHeader>
          <CardTitle>{pic.name}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong className="block text-sm text-muted-foreground">
                Title / Role
              </strong>
              <span>{pic.title || "-"}</span>
            </div>

            <div>
              <strong className="block text-sm text-muted-foreground">
                Phone
              </strong>
              <span>{pic.phone || "-"}</span>
            </div>

            <div>
              <strong className="block text-sm text-muted-foreground">
                Email
              </strong>
              <span>{pic.email || "-"}</span>
            </div>

            <div>
              <strong className="block text-sm text-muted-foreground">
                Client ID
              </strong>
              <span>{pic.client_id || "Not assigned"}</span>
            </div>

            <div>
              <strong className="block text-sm text-muted-foreground">
                Project ID
              </strong>
              <span>{pic.project_id || "Not assigned"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}