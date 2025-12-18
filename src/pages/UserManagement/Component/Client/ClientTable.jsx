import React, { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ClientForm from "./ClientForm"

export default function ClientTable({ clients, onDetail, onAddClient }) {
  const [search, setSearch] = useState("")
  const [sortAsc, setSortAsc] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10

  // filter + sort (BY CLIENT NAME)
  const filteredClients = useMemo(() => {
    let filtered = clients.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    )

    filtered.sort((a, b) =>
      sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )

    return filtered
  }, [clients, search, sortAsc])

  const totalPages = Math.ceil(filteredClients.length / perPage)
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Client List</h2>
        <ClientForm onSubmit={onAddClient} />
      </div>

      {/* SEARCH + SORT */}
      <div className="flex items-center justify-between space-x-2">
        <Input
          placeholder="Search client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortAsc(!sortAsc)}
        >
          Sort Name {sortAsc ? "A–Z" : "Z–A"}
        </Button>
      </div>

      {/* TABLE */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>NPWP</TableHead>
              <TableHead className="text-right">Action</TableHead>
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
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-2">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}