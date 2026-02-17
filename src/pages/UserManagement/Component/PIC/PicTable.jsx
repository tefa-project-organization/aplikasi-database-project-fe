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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PicForm from "./PicForm"
import PicDetail from "./PicDetail"
import EditPicForm from "./EditPicForm"
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

export default function PicTable({
    pics = [],
    clients = [],
    projects = [],
    onAddPic,
    onDeletePic,
    onUpdatePic,
    getPicById,
}) {
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("name_asc")
    const [currentPage, setCurrentPage] = useState(1)
    const [detailPic, setDetailPic] = useState(null)
    const [filterClient, setFilterClient] = useState("all")

    const perPage = 10

    const filteredPics = useMemo(() => {
        let data = pics
        if (search.trim()) data = data.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
        if (filterClient !== "all") data = data.filter((p) => String(p.client_id) === filterClient)

        switch (sortBy) {
            case "name_asc":
                data.sort((a, b) => a.name.localeCompare(b.name))
                break
            case "name_desc":
                data.sort((a, b) => b.name.localeCompare(a.name))
                break
            case "latest":
                data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                break
            case "oldest":
                data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                break
        }
        return data
    }, [pics, search, sortBy, filterClient])

    const totalPages = Math.ceil(filteredPics.length / perPage)
    const paginatedPics = filteredPics.slice((currentPage - 1) * perPage, currentPage * perPage)

    const getClientName = (id) => clients.find((c) => c.id === id)?.name || "-"
    const getProjectName = (id) => projects.find((p) => p.id === id)?.name || "-"

    const handleDeletePic = (pic) => {
        onDeletePic?.(pic)
    }

    if (detailPic) {
        return <PicDetail pic={detailPic} clients={clients} projects={projects} onClose={() => setDetailPic(null)} />
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">PIC List</h2>
                <PicForm onSubmit={onAddPic} clients={clients} projects={projects} pics={pics} />
            </div>

            <div className="flex flex-wrap items-center gap-2 justify-between">
                <Input placeholder="Search PIC..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <Select value={filterClient} onValueChange={setFilterClient}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Client" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Clients</SelectItem>
                            {clients.map((c) => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
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

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
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
                                <TableCell>{pic.client_name || getClientName(pic.client_id)}</TableCell>
                                <TableCell>{pic.project_name || getProjectName(pic.project_id)}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button size="sm" variant="outline" onClick={() => setDetailPic(pic)}>
                                        Detail
                                    </Button>
                                    <EditPicForm
                                        pic={pic}
                                        onSubmit={onUpdatePic}
                                        getPicById={getPicById}
                                        clients={clients}
                                        projects={projects}
                                    />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="destructive">Delete</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Hapus PIC</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Apakah kamu yakin ingin menghapus PIC <strong>{pic.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeletePic(pic)}>Hapus</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-between items-center">
                <span>
                    Page {currentPage} of {totalPages || 1}
                </span>
                <div className="space-x-2">
                    <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                        Prev
                    </Button>
                    <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
