import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ClientDetail({ client, allPics = [], onClose }) {
  // Filter PIC yang memiliki client_id sama dengan client.id
  const assignedPics = useMemo(() => {
    if (!client || !client.id) return []
    return allPics.filter(pic => pic.client_id === client.id)
  }, [client, allPics])

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

      {/* PIC Assignment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Assigned PICs</span>
            <span className="text-sm font-normal text-muted-foreground">
              {assignedPics.length} PIC{assignedPics.length !== 1 ? 's' : ''} assigned
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {assignedPics.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-lg">
              <p>No PIC assigned to this client</p>
              <p className="text-sm mt-1">Assign PIC through the PIC form</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table View */}
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50 dark:bg-gray-800">
                      <th className="text-left p-3 font-medium">PIC Name</th>
                      <th className="text-left p-3 font-medium">Title</th>
                      <th className="text-left p-3 font-medium">Email</th>
                      <th className="text-left p-3 font-medium">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedPics.map((pic) => (
                      <tr key={pic.id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="p-3 font-medium">{pic.name}</td>
                        <td className="p-3">{pic.title || "-"}</td>
                        <td className="p-3">{pic.email || "-"}</td>
                        <td className="p-3">{pic.phone || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Badges Summary */}
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Quick Overview:</h4>
                <div className="flex flex-wrap gap-2">
                  {assignedPics.map(pic => (
                    <Badge
                      key={pic.id}
                      variant="secondary"
                      className="px-3 py-1.5"
                    >
                      {pic.name} {pic.title ? `(${pic.title})` : ""}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}