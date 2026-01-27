import React, { useMemo, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ClientForm from "./ClientForm"
import EditClientForm from "./EditClientForm"

export default function ClientTable({
  clients = [],
  onDetail,
  onAddClient,
  onDeleteClient,
  onUpdateClient,
  getClientById,
}) {
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("name_asc")
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 5

  const filteredClients = useMemo(() => {
    let result = clients.filter((client) =>
      client.name.toLowerCase().includes(search.toLowerCase())
    )
    switch (sortBy) {
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name_desc":
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "latest":
        result.sort(
          (a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        )
        break
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created_at) - new Date(b.created_at)
        )
        break
      default:
        break
    }
    return result
  }, [clients, search, sortBy])

  const totalPages = Math.ceil(filteredClients.length / perPage)
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  const handleDeleteClient = (client) => {
    onDeleteClient?.(client)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Client List</h2>
        <ClientForm onSubmit={onAddClient} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search client..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
          className="max-w-xs"
        />
        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name_asc">
              Name (A–Z)
            </SelectItem>
            <SelectItem value="name_desc">
              Name (Z–A)
            </SelectItem>
            <SelectItem value="latest">
              Terbaru Ditambahkan
            </SelectItem>
            <SelectItem value="oldest">
              Terlama Ditambahkan
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>NPWP</TableHead>
              <TableHead className="text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  {client.name}
                </TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.npwp}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDetail?.(client)}
                  >
                    Detail
                  </Button>
                  <EditClientForm
                    client={client}
                    onSubmit={onUpdateClient}
                    getClientById={getClientById}
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Hapus Client
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah kamu yakin ingin
                          menghapus client
                          <strong>
                            {" "}
                            {client.name}
                          </strong>
                          ? Tindakan ini tidak dapat
                          dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleDeleteClient(client)
                          }
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <div className="space-x-2">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((prev) =>
                Math.max(prev - 1, 1)
              )
            }
          >
            Prev
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages)
              )
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}