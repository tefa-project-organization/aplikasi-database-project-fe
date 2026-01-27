/**
 * UserManagement.jsx
 * --------------------------------------------------
 * Halaman utama untuk manajemen User:
 * - Client
 * - PIC
 * - Employee
 *
 * Catatan:
 * - Data Client terhubung langsung ke API
 * - Data PIC & Employee masih menggunakan state lokal
 * - Struktur disiapkan untuk integrasi API lanjutan
 */

import React, { useState, useEffect } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// API helpers
import { apiGet, apiPost, apiDelete } from "@/lib/api"
import {
  CREATE_CLIENT,
  SHOW_ALL_CLIENTS,
  DELETE_CLIENT,
} from "@/constants/api/clients"

// Notification
import { toast } from "sonner"

// Components
import ClientTable from "../Component/Client/ClientTable"
import ClientDetail from "../Component/Client/ClientDetail"
import PicTable from "../Component/PIC/PicTable"
import EmployeeTable from "../Component/Employee/EmployeeTable"

export default function UserManagement() {
  /**
   * STATE: Selected data for detail view
   */
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedPic, setSelectedPic] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  /**
   * STATE: Client data from API
   */
  const [clients, setClients] = useState([])

  /**
   * STATE: Client data for combo box
   * (digunakan pada form PIC)
   */
  const [clientsForCombo, setClientsForCombo] = useState([])

  /**
   * STATE: PIC & Employee
   * (sementara masih lokal)
   */
  const [projectsForCombo, setProjectsForCombo] = useState([])
  const [pics, setPics] = useState([])
  const [employees, setEmployees] = useState([])

  /**
   * Fetch client data dari API
   * dan menyesuaikan struktur response
   */
  const fetchClients = async () => {
    try {
      const res = await apiGet(SHOW_ALL_CLIENTS)

      const items =
        res?.data?.items ||
        res?.data?.data?.items ||
        res?.items ||
        []

      setClients(items)

      setClientsForCombo(
        items.map((client) => ({
          id: client.id,
          name: client.name,
        }))
      )
    } catch (error) {
      console.error("Fetch clients error:", error)

      setClients([])
      setClientsForCombo([])

      toast.error("Gagal mengambil data client")
    }
  }

  /**
   * Add client (API)
   * Payload dikirim dari ClientForm
   */
  const handleAddClient = async (payload) => {
    try {
      const res = await apiPost(CREATE_CLIENT, payload)

      if (!res?.error) {
        toast.success("Client berhasil ditambahkan", {
          description: payload.name,
        })

        fetchClients()
      } else {
        toast.error("Gagal menambahkan client", {
          description: res?.message,
        })
      }
    } catch (error) {
      console.error("Create client error:", error)

      toast.error("Server error", {
        description: "Terjadi kesalahan pada server",
      })
    }
  }

  /**
   * Delete client (API)
   * Konfirmasi dilakukan di ClientTable (AlertDialog)
   */
  const handleDeleteClient = async (client) => {
    if (!client?.id) return

    try {
      const res = await apiDelete(DELETE_CLIENT(client.id))

      if (!res?.error) {
        toast.success("Client berhasil dihapus", {
          description: client.name,
        })

        fetchClients()
      } else {
        toast.error("Gagal menghapus client", {
          description: res?.message,
        })
      }
    } catch (error) {
      console.error("Delete client error:", error)

      toast.error("Server error", {
        description: "Terjadi kesalahan pada server",
      })
    }
  }

  /**
   * Add PIC (local state)
   */
  const handleAddPic = (newPic) => {
    setPics((prev) => [...prev, newPic])
  }

  /**
   * Add Employee (local state)
   */
  const handleAddEmployee = (newEmployee) => {
    setEmployees((prev) => [...prev, newEmployee])
  }

  /**
   * Ambil PIC berdasarkan client ID
   * Digunakan di ClientDetail
   */
  const getPicsForClient = (clientId) => {
    return pics.filter((pic) => pic.client_id === clientId)
  }

  /**
   * Lifecycle
   * Fetch client data saat halaman pertama kali dibuka
   */
  useEffect(() => {
    fetchClients()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      <Tabs defaultValue="client" className="space-y-6">
        <TabsList>
          <TabsTrigger value="client">Client</TabsTrigger>
          <TabsTrigger value="pic">PIC</TabsTrigger>
          <TabsTrigger value="employee">Employee</TabsTrigger>
        </TabsList>

        {/* CLIENT TAB */}
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
              onDeleteClient={handleDeleteClient}
            />
          )}
        </TabsContent>

        {/* PIC TAB */}
        <TabsContent value="pic">
          <PicTable
            pics={pics}
            clients={clientsForCombo}
            projects={projectsForCombo}
            onDetail={setSelectedPic}
            onAddPic={handleAddPic}
          />
        </TabsContent>

        {/* EMPLOYEE TAB */}
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
