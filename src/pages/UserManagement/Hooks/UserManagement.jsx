import React, { useState, useMemo } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import ClientTable from "../Component/Client/ClientTable"
import ClientDetail from "../Component/Client/ClientDetail"
import PicTable from "../Component/PIC/PicTable"

// sementara dummy component supaya ga error
const EmployeeTable = () => <div className="text-gray-500">Employee Table (Coming Soon)</div>

// dummy clients
const initialClients = [
  {
    id: 1,
    name: "PT Maju Jaya Abadi",
    description: "Supplier alat tulis",
    address: "Jl. Merdeka No.1",
    phone: "021-88990011",
    npwp: "01.234.567.8-999.000",
    status: "active",
  },
  {
    id: 2,
    name: "CV Sumber Rejeki",
    description: "Distributor makanan",
    address: "Jl. Sudirman No.5",
    phone: "022-77889900",
    npwp: "02.987.654.3-888.000",
    status: "inactive",
  },
]

// dummy PICs - HARUS SAMA dengan di ClientDetail.jsx
const initialPics = [
  { 
    id: 1, 
    name: "John Doe", 
    phone: "08123456789", 
    email: "john@example.com", 
    title: "Manager",
    client_id: 1,  // Terhubung dengan PT Maju Jaya Abadi
    project_id: 1
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    phone: "08987654321", 
    email: "jane@example.com", 
    title: "Supervisor",
    client_id: 1,  // Juga terhubung dengan PT Maju Jaya Abadi
    project_id: 2
  },
  { 
    id: 3, 
    name: "Bob Johnson", 
    phone: "08765432109", 
    email: "bob@example.com", 
    title: "Staff",
    client_id: 2,  // Terhubung dengan CV Sumber Rejeki
    project_id: 3
  },
  { 
    id: 4, 
    name: "Alice Brown", 
    phone: "08512345678", 
    email: "alice@example.com", 
    title: "Manager",
    client_id: null,  // Belum ditugaskan ke client manapun
    project_id: null
  },
]

export default function UserManagement() {
  const [selectedClient, setSelectedClient] = useState(null)
  const [clients, setClients] = useState(initialClients)

  const [pics, setPics] = useState(initialPics)
  const [selectedPic, setSelectedPic] = useState(null)

  const handleAddClient = (newClient) => {
    setClients((prev) => [...prev, { ...newClient, id: prev.length + 1 }])
  }

  const handleAddPic = (newPic) => {
    setPics((prev) => [...prev, { ...newPic, id: prev.length + 1 }])
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      <Tabs defaultValue="client" className="space-y-6">
        <TabsList>
          <TabsTrigger value="client">Client</TabsTrigger>
          <TabsTrigger value="pic">PIC</TabsTrigger>
          <TabsTrigger value="employee">Employee</TabsTrigger>
        </TabsList>

        <TabsContent value="client">
          {selectedClient ? (
            <ClientDetail
              client={selectedClient}
              onClose={() => setSelectedClient(null)}
            />
          ) : (
            <ClientTable
              clients={clients}
              onDetail={setSelectedClient}
              onAddClient={handleAddClient}
            />
          )}
        </TabsContent>

        <TabsContent value="pic">
          <PicTable
            pics={pics}
            onDetail={setSelectedPic}
            onAddPic={handleAddPic}
          />
        </TabsContent>

        <TabsContent value="employee">
          <EmployeeTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}