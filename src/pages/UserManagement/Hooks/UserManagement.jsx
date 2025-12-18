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
import EmployeeTable from "../Component/Employee/EmployeeTable"

// dummy clients (untuk Client tab)
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

// dummy clients (untuk PIC form combo box)
const initialClientsForCombo = [
  { id: 1, name: "PT Maju Jaya Abadi" },
  { id: 2, name: "CV Sumber Rejeki" },
  { id: 3, name: "PT Sejahtera Sentosa" },
]

// dummy projects (untuk PIC form combo box)
const initialProjectsForCombo = [
  { id: 1, name: "Website Development" },
  { id: 2, name: "Mobile App" },
  { id: 3, name: "ERP System" },
  { id: 4, name: "Cloud Migration" },
]

// dummy PICs - dengan nama client dan project
const initialPics = [
  {
    id: 1,
    name: "John Doe",
    phone: "08123456789",
    email: "john@example.com",
    title: "Manager",
    client_id: 1,
    client_name: "PT Maju Jaya Abadi",
    project_id: 1,
    project_name: "Website Development"
  },
  {
    id: 2,
    name: "Jane Smith",
    phone: "08987654321",
    email: "jane@example.com",
    title: "Supervisor",
    client_id: 1,
    client_name: "PT Maju Jaya Abadi",
    project_id: 2,
    project_name: "Mobile App"
  },
  {
    id: 3,
    name: "Bob Johnson",
    phone: "08765432109",
    email: "bob@example.com",
    title: "Staff",
    client_id: 2,
    client_name: "CV Sumber Rejeki",
    project_id: 3,
    project_name: "ERP System"
  },
  {
    id: 4,
    name: "Alice Brown",
    phone: "08512345678",
    email: "alice@example.com",
    title: "Manager",
    client_id: null,
    client_name: null,
    project_id: null,
    project_name: null
  },
]

// dummy employees
const initialEmployees = [
  {
    id: 1,
    nik: "32700001",
    nip: "10001",
    name: "Rafii",
    email: "rafi1@mail.com",
    password: "123456",
    address: "Jl. Merdeka No. 10",
    phone: "08220000001",
    position: "Backend Developer",
    status: "active"
  },
  {
    id: 2,
    nik: "32700002",
    nip: "10002",
    name: "Siti",
    email: "siti@mail.com",
    password: "123456",
    address: "Jl. Sudirman No. 20",
    phone: "08220000002",
    position: "Frontend Developer",
    status: "active"
  },
  {
    id: 3,
    nik: "32700003",
    nip: "10003",
    name: "Budi",
    email: "budi@mail.com",
    password: "123456",
    address: "Jl. Gatot Subroto No. 30",
    phone: "08220000003",
    position: "UI/UX Designer",
    status: "resigned"
  },
  {
    id: 4,
    nik: "32700004",
    nip: "10004",
    name: "Ani",
    email: "ani@mail.com",
    password: "123456",
    address: "Jl. Thamrin No. 40",
    phone: "08220000004",
    position: "Project Manager",
    status: "active"
  },
]

export default function UserManagement() {
  const [selectedClient, setSelectedClient] = useState(null)
  const [clients, setClients] = useState(initialClients)
  const [clientsForCombo, setClientsForCombo] = useState(initialClientsForCombo)
  const [projectsForCombo, setProjectsForCombo] = useState(initialProjectsForCombo)

  const [pics, setPics] = useState(initialPics)
  const [selectedPic, setSelectedPic] = useState(null)

  const [employees, setEmployees] = useState(initialEmployees)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const handleAddClient = (newClient) => {
    const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1
    setClients((prev) => [...prev, { ...newClient, id: newId }])

    // Juga tambahkan ke clientsForCombo untuk PIC form
    setClientsForCombo((prev) => [...prev, { id: newId, name: newClient.name }])
  }

  const handleAddPic = (newPic) => {
    const newId = pics.length > 0 ? Math.max(...pics.map(p => p.id)) + 1 : 1

    // Cari nama client dan project berdasarkan ID
    const client = clientsForCombo.find(c => c.id === newPic.client_id)
    const project = projectsForCombo.find(p => p.id === newPic.project_id)

    const picWithNames = {
      ...newPic,
      id: newId,
      client_name: client ? client.name : null,
      project_name: project ? project.name : null
    }

    setPics((prev) => [...prev, picWithNames])
  }

  const handleAddEmployee = (newEmployee) => {
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1
    setEmployees((prev) => [...prev, { ...newEmployee, id: newId }])
  }

  // Fungsi untuk mendapatkan PIC yang terhubung dengan client
  const getPicsForClient = (clientId) => {
    return pics.filter(pic => pic.client_id === clientId)
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
              allPics={getPicsForClient(selectedClient.id)}
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
            clients={clientsForCombo}
            projects={projectsForCombo}
            onDetail={setSelectedPic}
            onAddPic={handleAddPic}
          />
        </TabsContent>

        <TabsContent value="employee">
          <EmployeeTable
            employees={employees}
            onDetail={setSelectedEmployee}
            onAddEmployee={handleAddEmployee}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}