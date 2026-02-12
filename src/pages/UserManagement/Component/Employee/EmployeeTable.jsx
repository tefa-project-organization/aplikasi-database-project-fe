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
import { Badge } from "@/components/ui/badge"
import EmployeeForm from "./EmployeeForm"
import EmployeeDetail from "./EmployeeDetail"
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
import { toast } from "sonner"

export default function EmployeeTable({ employees = [], onAddEmployee, onDetail, onDeleteEmployee }) {
    const [search, setSearch] = useState("")
    const [sortAsc, setSortAsc] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [detailEmployee, setDetailEmployee] = useState(null)
    const [employeeToDelete, setEmployeeToDelete] = useState(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const perPage = 10

    const handleDelete = async () => {
        if (!employeeToDelete) return
        try {
            await onDeleteEmployee(employeeToDelete)
            toast.success("Employee berhasil dihapus")
        } catch (error) {
            toast.error("Gagal menghapus employee")
        }
        setIsDeleteDialogOpen(false)
        setEmployeeToDelete(null)
    }

    // filter + sort by name
    const filteredEmployees = useMemo(() => {
        let filtered = employees.filter((emp) =>
            emp.name?.toLowerCase().includes(search.toLowerCase()) ||
            emp.nip?.toLowerCase().includes(search.toLowerCase()) ||
            emp.position?.position_name?.toLowerCase().includes(search.toLowerCase())
        )

        filtered.sort((a, b) =>
            sortAsc
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name)
        )

        return filtered
    }, [employees, search, sortAsc])

    const totalPages = Math.ceil(filteredEmployees.length / perPage)
    const paginatedEmployees = filteredEmployees.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    )

    // Fungsi untuk menentukan warna badge
    const getBadgeStyles = (status) => {
        const baseStyle = "font-medium text-black"

        switch (status?.toLowerCase()) {
            case "active":
                return `${baseStyle} bg-emerald-400 hover:bg-emerald-500 border-emerald-500`
            case "resigned":
                return `${baseStyle} bg-red-700 hover:bg-red-800 border-red-800`
            case "freelance":
                return `${baseStyle} bg-blue-500 hover:bg-blue-600 border-blue-600`
            default:
                return `${baseStyle} bg-gray-300 hover:bg-gray-400 border-gray-400`
        }
    }

    // DETAIL PAGE
    if (detailEmployee) {
        return (
            <EmployeeDetail
                employee={detailEmployee}
                onClose={() => setDetailEmployee(null)}
            />
        )
    }

    return (
        <div className="space-y-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Employee List</h2>
                <EmployeeForm onSubmit={onAddEmployee} />
            </div>

            {/* SEARCH + SORT */}
            <div className="flex items-center justify-between gap-2">
                <Input
                    placeholder="Search employee..."
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
                            <TableHead>NIK</TableHead>
                            <TableHead>NIP</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginatedEmployees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell className="font-medium">{employee.nik?.trim()}</TableCell>
                                <TableCell>{employee.nip?.trim()}</TableCell>
                                <TableCell className="font-medium">{employee.name}</TableCell>
                                <TableCell>{employee.position?.position_name || "-"}</TableCell>
                                <TableCell>{employee.email || "-"}</TableCell>
                                <TableCell>{employee.phone || "-"}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={getBadgeStyles(employee.status?.status_name?.toLowerCase())}
                                    >
                                        {employee.status?.status_name || "-"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setDetailEmployee(employee)}
                                    >
                                        Detail
                                    </Button>
                                    <AlertDialog open={isDeleteDialogOpen && employeeToDelete?.id === employee.id} onOpenChange={(open) => {
                                        setIsDeleteDialogOpen(open)
                                        if (!open) setEmployeeToDelete(null)
                                    }}>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => setEmployeeToDelete(employee)}
                                            >
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Apakah Anda yakin ingin menghapus employee "{employee.name}"? Tindakan ini tidak dapat dibatalkan.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel onClick={() => setEmployeeToDelete(null)}>Batal</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDelete}>
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