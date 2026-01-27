import React, { useState, useEffect } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api"
import {
  CREATE_CLIENT,
  SHOW_ALL_CLIENTS,
  SHOW_ONE_CLIENT,
  UPDATE_CLIENT,
  DELETE_CLIENT,
} from "@/constants/api/clients"
import { toast } from "sonner"
import ClientTable from "../Component/Client/ClientTable"
import ClientDetail from "../Component/Client/ClientDetail"
import PicTable from "../Component/PIC/PicTable"
import EmployeeTable from "../Component/Employee/EmployeeTable"

export default function UserManagement() {
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedPic, setSelectedPic] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [clients, setClients] = useState([])
  const [clientsForCombo, setClientsForCombo] = useState([])
  const [projectsForCombo, setProjectsForCombo] = useState([])
  const [pics, setPics] = useState([])
  const [employees, setEmployees] = useState([])

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

  const getClientById = async (id) => {
    try {
      const res = await apiGet(SHOW_ONE_CLIENT(id))
      if (!res?.error) {
        return res.data
      } else {
        toast.error("Gagal mengambil detail client", {
          description: res?.message,
        })
        return null
      }
    } catch (error) {
      console.error("Get client by ID error:", error)
      toast.error("Server error", {
        description: "Terjadi kesalahan pada server",
      })
      return null
    }
  }

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

  const handleUpdateClient = async (id, payload) => {
    try {
      const res = await apiPut(UPDATE_CLIENT(id), payload)
      if (!res?.error) {
        toast.success("Client berhasil diperbarui", {
          description: payload.name,
        })
        fetchClients()
        return true
      } else {
        toast.error("Gagal memperbarui client", {
          description: res?.message,
        })
        return false
      }
    } catch (error) {
      console.error("Update client error:", error)
      toast.error("Server error", {
        description: "Terjadi kesalahan pada server",
      })
      return false
    }
  }

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

  const handleAddPic = (newPic) => {
    setPics((prev) => [...prev, newPic])
  }

  const handleAddEmployee = (newEmployee) => {
    setEmployees((prev) => [...prev, newEmployee])
  }

  const getPicsForClient = (clientId) => {
    return pics.filter((pic) => pic.client_id === clientId)
  }

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
        <TabsContent value="client">
          {selectedClient ? (
            <ClientDetail
              client={selectedClient}
              allPics={getPicsForClient(selectedClient.id)}
              onClose={() => setSelectedClient(null)}
              onUpdateClient={handleUpdateClient}
              getClientById={getClientById}
            />
          ) : (
            <ClientTable
              clients={clients}
              onDetail={setSelectedClient}
              onAddClient={handleAddClient}
              onDeleteClient={handleDeleteClient}
              onUpdateClient={handleUpdateClient}
              getClientById={getClientById}
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