import React, { useState } from "react"
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

// dummy PICs
const initialPics = [
  { id: 1, name: "Rina", phone: "0812-3456-7890", email: "rina@mail.com", status: "active" },
  { id: 2, name: "Budi", phone: "0813-9876-5432", email: "budi@mail.com", status: "inactive" },
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
