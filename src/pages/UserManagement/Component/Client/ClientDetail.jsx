// src/pages/UserManagement/Component/Client/ClientDetail.jsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ClientPicTable from "./ClientPicTable";

// Dummy data - nanti akan diganti dengan data dari API/store
const dummyAllPics = [
  { id: 1, name: "John Doe", phone: "08123456789", email: "john@example.com", status: "active", position: "Manager" },
  { id: 2, name: "Jane Smith", phone: "08987654321", email: "jane@example.com", status: "active", position: "Supervisor" },
  { id: 3, name: "Bob Johnson", phone: "08765432109", email: "bob@example.com", status: "inactive", position: "Staff" },
];

export default function ClientDetail({ client, onClose }) {
  const [selectedPicIds, setSelectedPicIds] = useState(
    client?.picIds || [1] // Contoh: client memiliki PIC dengan ID 1
  );

  if (!client) return null;

  const handlePicSelectionChange = (newSelectedIds) => {
    setSelectedPicIds(newSelectedIds);
    // Di sini Anda bisa menambahkan logic untuk menyimpan ke API
    console.log("Selected PIC IDs:", newSelectedIds);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Client Detail</h2>
        <button
          className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {/* Client Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{client.name}</span>
            <Badge variant={client.status === "active" ? "default" : "secondary"}>
              {client.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong className="block text-sm text-gray-500 dark:text-gray-400">Description</strong>
              <span className="dark:text-gray-300">{client.description || "-"}</span>
            </div>
            <div>
              <strong className="block text-sm text-gray-500 dark:text-gray-400">Address</strong>
              <span className="dark:text-gray-300">{client.address || "-"}</span>
            </div>
            <div>
              <strong className="block text-sm text-gray-500 dark:text-gray-400">Phone</strong>
              <span className="dark:text-gray-300">{client.phone || "-"}</span>
            </div>
            <div>
              <strong className="block text-sm text-gray-500 dark:text-gray-400">NPWP</strong>
              <span className="dark:text-gray-300">{client.npwp || "-"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PIC Assignment Section */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned PICs</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientPicTable
            allPics={dummyAllPics} // Ganti dengan data dari store/API
            selectedPicIds={selectedPicIds}
            onSelectionChange={handlePicSelectionChange}
          />
          
          {/* Selected PICs Summary - MENGGUNAKAN CARD YANG SAMA */}
          {selectedPicIds.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">
                  Selected PICs ({selectedPicIds.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {dummyAllPics
                    .filter(pic => selectedPicIds.includes(pic.id))
                    .map(pic => (
                      <Badge 
                        key={pic.id} 
                        variant="outline" 
                        className="px-3 py-1 dark:border-gray-600 dark:text-gray-300"
                      >
                        {pic.name} ({pic.position})
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}