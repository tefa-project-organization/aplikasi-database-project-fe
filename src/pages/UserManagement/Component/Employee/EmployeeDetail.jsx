import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function EmployeeDetail({ employee, onClose }) {
  if (!employee) return null

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">Employee Detail</h2>
          <Badge
            variant="outline"
            className={
              employee.status === "active"
                ? "bg-blue-400 hover:bg-blue-500 border-blue-500 text-black dark:text-black font-medium"
                : employee.status === "resigned"
                  ? "bg-red-400 hover:bg-red-500 border-red-500 text-black dark:text-black font-medium"
                  : "bg-gray-300 hover:bg-gray-400 border-gray-400 text-black dark:text-black font-medium"
            }
          >
            {employee.status}
          </Badge>
        </div>

        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex items-center gap-1"
          >
            ← Back to Employee List
          </Button>
        )}
      </div>

      {/* MAIN INFO */}
      <Card>
        <CardHeader>
          <CardTitle>{employee.name}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* NIK */}
            <div>
              <strong className="block text-sm text-muted-foreground">
                NIK
              </strong>
              <span className="font-medium">{employee.nik}</span>
            </div>

            {/* NIP */}
            <div>
              <strong className="block text-sm text-muted-foreground">
                NIP
              </strong>
              <span className="font-medium">{employee.nip}</span>
            </div>

            {/* Position */}
            <div>
              <strong className="block text-sm text-muted-foreground">
                Position
              </strong>
              <span>{employee.position || "-"}</span>
            </div>

            {/* Email */}
            <div>
              <strong className="block text-sm text-muted-foreground">
                Email
              </strong>
              <span>{employee.email || "-"}</span>
            </div>

            {/* Phone */}
            <div>
              <strong className="block text-sm text-muted-foreground">
                Phone
              </strong>
              <span>{employee.phone || "-"}</span>
            </div>

            {/* Status */}
            <div>
              <strong className="block text-sm text-muted-foreground">
                Status
              </strong>
              <span className="capitalize">{employee.status}</span>
            </div>
          </div>

          {/* Address (full width) */}
          <div className="pt-2">
            <strong className="block text-sm text-muted-foreground mb-1">
              Address
            </strong>
            <p className="text-sm">{employee.address || "-"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}