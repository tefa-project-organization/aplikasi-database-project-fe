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
import PicForm from "./PicForm"
import PicDetail from "./PicDetail"

export default function PicTable({ pics = [], clients = [], projects = [], onAddPic, onDeletePic }) {
    const [search, setSearch] = useState("")
    const [sortAsc, setSortAsc] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [detailPic, setDetailPic] = useState(null)

    const perPage = 10

    // filter + sort by name
    const filteredPics = useMemo(() => {
        let filtered = pics.filter((p) =>
            p.name?.toLowerCase().includes(search.toLowerCase())
        )

        filtered.sort((a, b) =>
            sortAsc
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name)
        )

        return filtered
    }, [pics, search, sortAsc])

    const totalPages = Math.ceil(filteredPics.length / perPage)
    const paginatedPics = filteredPics.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    )

    // Fungsi untuk mendapatkan nama dari ID
    const getClientName = (clientId) => {
        if (!clientId) return "-"
        const client = clients.find(c => c.id === clientId)
        return client ? client.name : `ID: ${clientId}`
    }

    const getProjectName = (projectId) => {
        if (!projectId) return "-"
        const project = projects.find(p => p.id === projectId)
        return project ? project.name : `ID: ${projectId}`
    }

    // DETAIL PAGE
    if (detailPic) {
        return (
            <PicDetail
                pic={detailPic}
                onClose={() => setDetailPic(null)}
            />
        )
    }

    return (
        <div className="space-y-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">PIC List</h2>
                <PicForm
                    onSubmit={onAddPic}
                    clients={clients}
                    projects={projects}
                />
            </div>

            {/* SEARCH + SORT */}
            <div className="flex items-center justify-between gap-2">
                <Input
                    placeholder="Search PIC..."
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
                            <TableHead>PIC Name</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginatedPics.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground">
                                    No PIC found
                                </TableCell>
                            </TableRow>
                        )}

                        {paginatedPics.map((pic) => (
                            <TableRow key={pic.id}>
                                <TableCell className="font-medium">{pic.name}</TableCell>
                                <TableCell>{pic.title || "-"}</TableCell>
                                <TableCell>{pic.phone || "-"}</TableCell>
                                <TableCell>{pic.email || "-"}</TableCell>
                                <TableCell>
                                    {pic.client_name || getClientName(pic.client_id)}
                                </TableCell>
                                <TableCell>
                                    {pic.project_name || getProjectName(pic.project_id)}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setDetailPic(pic)}
                                    >
                                        Detail
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => onDeletePic?.(pic)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center">
                <span>
                    Page {currentPage} of {totalPages || 1}
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