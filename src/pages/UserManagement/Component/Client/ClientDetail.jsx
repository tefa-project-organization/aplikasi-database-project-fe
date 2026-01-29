import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ClientDetail({ client, onClose }) {
  if (!client) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Client Detail</h2>

        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex items-center gap-1"
          >
            ← Back to Client List
          </Button>
        )}
      </div>

      {/* Client Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            {client.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong className="block text-sm text-gray-500 dark:text-gray-400">
                Description
              </strong>
              <span className="dark:text-gray-300">
                {client.description || "-"}
              </span>
            </div>

            <div>
              <strong className="block text-sm text-gray-500 dark:text-gray-400">
                Address
              </strong>
              <span className="dark:text-gray-300">
                {client.address || "-"}
              </span>
            </div>

            <div>
              <strong className="block text-sm text-gray-500 dark:text-gray-400">
                Phone
              </strong>
              <span className="dark:text-gray-300">
                {client.phone || "-"}
              </span>
            </div>

            <div>
              <strong className="block text-sm text-gray-500 dark:text-gray-400">
                NPWP
              </strong>
              <span className="dark:text-gray-300">
                {client.npwp || "-"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
