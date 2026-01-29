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
import {
  CREATE_CLIENT_PIC,
  SHOW_ALL_CLIENT_PICS,
  SHOW_ONE_CLIENT_PIC,
  UPDATE_CLIENT_PIC,
  DELETE_CLIENT_PIC,
} from "@/constants/api/client_pic"
import { SHOW_ALL_PROJECTS } from "@/constants/api/project"
import { toast } from "sonner"

import ClientTable from "../Component/Client/ClientTable"
import ClientDetail from "../Component/Client/ClientDetail"
import PicTable from "../Component/PIC/PicTable"
import EmployeeTable from "../Component/Employee/EmployeeTable"

export default function UserManagement() {
  const [selectedClient, setSelectedClient] = useState(null)
  const [clients, setClients] = useState([])
  const [clientsForCombo, setClientsForCombo] = useState([])
  const [projectsForCombo, setProjectsForCombo] = useState([])

  const [pics, setPics] = useState([])
  const [employees, setEmployees] = useState([])

  /* ===================== CLIENT ===================== */
  const fetchClients = async () => {
    try {
      const res = await apiGet(SHOW_ALL_CLIENTS)
      const items = res?.data?.items || res?.data?.data?.items || res?.items || []
      setClients(items)
      setClientsForCombo(items.map((c) => ({ id: c.id, name: c.name })))
    } catch (err) {
      console.error(err)
      setClients([])
      setClientsForCombo([])
      toast.error("Gagal mengambil data client")
    }
  }

  const getClientById = async (id) => {
    try {
      const res = await apiGet(SHOW_ONE_CLIENT(id))
      return res?.data || null
    } catch (err) {
      toast.error("Gagal mengambil detail client")
      return null
    }
  }

  const handleAddClient = async (payload) => {
    try {
      const res = await apiPost(CREATE_CLIENT, payload)
      if (!res?.error) {
        toast.success("Client berhasil ditambahkan")
        fetchClients()
      }
    } catch {
      toast.error("Gagal menambahkan client")
    }
  }

  const handleUpdateClient = async (id, payload) => {
    try {
      const res = await apiPut(UPDATE_CLIENT(id), payload)
      if (!res?.error) {
        toast.success("Client berhasil diperbarui")
        fetchClients()
        return true
      }
    } catch { }
    return false
  }

  const handleDeleteClient = async (client) => {
    if (!client?.id) return
    try {
      const res = await apiDelete(DELETE_CLIENT(client.id))
      if (!res?.error) {
        toast.success("Client berhasil dihapus")
        fetchClients()
      }
    } catch {
      toast.error("Gagal menghapus client")
    }
  }

  /* ===================== PIC ===================== */
  const fetchPics = async () => {
    try {
      const res = await apiGet(SHOW_ALL_CLIENT_PICS)
      const items = res?.data?.items || res?.data?.data?.items || res?.items || []
      setPics(items)
    } catch (err) {
      console.error(err)
      setPics([])
      toast.error("Gagal mengambil data PIC")
    }
  }

  const getPicById = async (id) => {
    try {
      const res = await apiGet(SHOW_ONE_CLIENT_PIC(id))
      return res?.data || null
    } catch {
      toast.error("Gagal mengambil detail PIC")
      return null
    }
  }

  const handleAddPic = async (payload) => {
    try {
      const res = await apiPost(CREATE_CLIENT_PIC, payload)
      if (!res?.error) {
        toast.success("PIC berhasil ditambahkan")
        fetchPics()
      }
    } catch {
      toast.error("Gagal menambahkan PIC")
    }
  }

  const handleUpdatePic = async (id, payload) => {
    try {
      const res = await apiPut(UPDATE_CLIENT_PIC(id), payload)
      if (!res?.error) {
        toast.success("PIC berhasil diperbarui")
        fetchPics()
        return true
      }
    } catch { }
    return false
  }

  const handleDeletePic = async (pic) => {
    if (!pic?.id) return
    try {
      const res = await apiDelete(DELETE_CLIENT_PIC(pic.id))
      if (!res?.error) {
        toast.success("PIC berhasil dihapus")
        fetchPics()
      }
    } catch {
      toast.error("Gagal menghapus PIC")
    }
  }

  /* ===================== PROJECT ===================== */
  const fetchProjects = async () => {
    try {
      const res = await apiGet(SHOW_ALL_PROJECTS)
      const items = res?.data?.items || res?.data?.data?.items || res?.items || []
      setProjectsForCombo(items.map((p) => ({
        id: p.id,
        name: p.project_name || p.project_name || "-"  // Perbaikan di sini
      })))
    } catch (err) {
      console.error(err)
      setProjectsForCombo([])
      toast.error("Gagal mengambil data project")
    }
  }

  /* ===================== EFFECT ===================== */
  useEffect(() => {
    fetchClients()
    fetchPics()
    fetchProjects()
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
            onAddPic={handleAddPic}
            onDeletePic={handleDeletePic}
            onUpdatePic={handleUpdatePic}
            getPicById={getPicById}
          />
        </TabsContent>

        <TabsContent value="employee">
          <EmployeeTable
            employees={employees}
            onAddEmployee={(e) => setEmployees((p) => [...p, e])}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
