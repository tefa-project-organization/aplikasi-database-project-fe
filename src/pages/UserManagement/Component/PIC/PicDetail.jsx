// src/pages/UserManagement/Component/PIC/PicDetail.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PicDetail({ pic, onClose }) {
  if (!pic) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">PIC Detail</h2>
        <button
          className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {/* PIC Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{pic.name}</span>
            <Badge variant={pic.status === "active" ? "default" : "secondary"}>
              {pic.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong className="block text-sm text-gray-500 dark:text-gray-400">Position</strong>
              <span className="dark:text-gray-300">{pic.position || "-"}</span>
            </div>
            <div>
              <strong className="block text-sm text-gray-500 dark:text-gray-400">Phone</strong>
              <span className="dark:text-gray-300">{pic.phone || "-"}</span>
            </div>
            <div>
              <strong className="block text-sm text-gray-500 dark:text-gray-400">Email</strong>
              <span className="dark:text-gray-300">{pic.email || "-"}</span>
            </div>
            <div>
              <strong className="block text-sm text-gray-500 dark:text-gray-400">Address</strong>
              <span className="dark:text-gray-300">{pic.address || "-"}</span>
            </div>
            <div className="col-span-2">
              <strong className="block text-sm text-gray-500 dark:text-gray-400">Description</strong>
              <span className="dark:text-gray-300">{pic.description || "-"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Clients Section */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            This PIC is assigned to the following clients
          </p>
          
          {/* Dummy client list - ganti dengan data nyata */}
          <div className="space-y-2">
            {[
              { id: 1, name: "Client A", status: "active" },
              { id: 2, name: "Client B", status: "active" },
            ].map(client => (
              <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{client.name}</p>
                </div>
                <Badge variant={client.status === "active" ? "default" : "secondary"}>
                  {client.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}