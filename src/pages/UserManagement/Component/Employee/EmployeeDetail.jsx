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
              employee.status?.status_name?.toLowerCase() === "active"
                ? "bg-emerald-400 hover:bg-emerald-500 border-emerald-500 text-black font-medium"
                : employee.status?.status_name?.toLowerCase() === "resigned"
                  ? "bg-red-700 hover:bg-red-800 border-red-800 text-black font-medium"
                  : employee.status?.status_name?.toLowerCase() === "freelance"
                    ? "bg-blue-500 hover:bg-blue-600 border-blue-600 text-black font-medium"
                    : "bg-gray-300 hover:bg-gray-400 border-gray-400 text-black font-medium"
            }
          >
            {employee.status?.status_name || "-"}
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
              <span className="font-medium">{employee.nik?.trim()}</span>
            </div>

            {/* NIP */}
            <div>
              <strong className="block text-sm text-muted-foreground">
                NIP
              </strong>
              <span className="font-medium">{employee.nip?.trim()}</span>
            </div>

            {/* Position */}
            <div>
              <strong className="block text-sm text-muted-foreground">
                Position
              </strong>
              <span>{employee.position?.position_name || "-"}</span>
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
              <span className="capitalize">{employee.status?.status_name || "-"}</span>
            </div>

            {/* Department */}
            <div>
              <strong className="block text-sm text-muted-foreground">
                Department
              </strong>
              <span>{employee.department?.department_name || "-"}</span>
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