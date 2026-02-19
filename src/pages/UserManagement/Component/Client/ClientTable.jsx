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
import AdvancedPagination from "@/components/ui/AdvancedPagination"
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
      {/* HEADER + ADD BUTTON */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Client List</h2>
        <ClientForm onSubmit={onAddClient} />
      </div>

      {/* SEARCH LEFT + FILTER + SORT RIGHT */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Search Input */}
        <Input
          placeholder="Search client..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
          className="max-w-xs"
        />

        {/* Filter + Sort */}
        <div className="flex flex-wrap gap-2">
          <Select value={sortBy} onValueChange={(value) => {
            setSortBy(value)
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Name (A–Z)</SelectItem>
              <SelectItem value="name_desc">Name (Z–A)</SelectItem>
              <SelectItem value="latest">Terbaru Ditambahkan</SelectItem>
              <SelectItem value="oldest">Terlama Ditambahkan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[600px] md:min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Client Name</TableHead>
              <TableHead className="whitespace-nowrap hidden sm:table-cell">Phone</TableHead>
              <TableHead className="whitespace-nowrap hidden md:table-cell">NPWP</TableHead>
              <TableHead className="text-right whitespace-nowrap">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedClients.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No client found
                </TableCell>
              </TableRow>
            )}
            {paginatedClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {client.name}
                </TableCell>
                <TableCell className="whitespace-nowrap hidden sm:table-cell">{client.phone}</TableCell>
                <TableCell className="whitespace-nowrap hidden md:table-cell">{client.npwp}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex justify-end gap-2 flex-wrap">
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
                            <strong> {client.name} </strong>
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
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <AdvancedPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
