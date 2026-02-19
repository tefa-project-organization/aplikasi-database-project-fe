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
import AdvancedPagination from "@/components/ui/AdvancedPagination"
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

            <div className="rounded-md border overflow-x-auto">
                <Table className="min-w-[250px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="whitespace-nowrap">Name</TableHead>
                            <TableHead className="whitespace-nowrap hidden sm:table-cell">Title</TableHead>
                            <TableHead className="whitespace-nowrap hidden md:table-cell">Phone</TableHead>
                            <TableHead className="whitespace-nowrap hidden lg:table-cell">Email</TableHead>
                            <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedPics.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    No PIC found
                                </TableCell>
                            </TableRow>
                        )}
                        {paginatedPics.map((pic) => (
                            <TableRow key={pic.id}>
                                <TableCell className="font-medium whitespace-nowrap">{pic.name}</TableCell>
                                <TableCell className="whitespace-nowrap hidden sm:table-cell">{pic.title || "-"}</TableCell>
                                <TableCell className="whitespace-nowrap hidden md:table-cell">{pic.phone || "-"}</TableCell>
                                <TableCell className="whitespace-nowrap hidden lg:table-cell">{pic.email || "-"}</TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                    <div className="flex justify-end gap-1 flex-nowrap">
                                        <Button size="icon" variant="outline" className="h-8 w-8 p-0" onClick={() => setDetailPic(pic)} title="Detail">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
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
                                                <Button size="icon" variant="destructive" className="h-8 w-8 p-0" title="Delete">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                                </Button>
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
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AdvancedPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}
