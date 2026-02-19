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
import AdvancedPagination from "@/components/ui/AdvancedPagination"
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
            <div className="rounded-md border overflow-x-auto">
                <Table className="min-w-[900px] md:min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="whitespace-nowrap hidden sm:table-cell">NIK</TableHead>
                            <TableHead className="whitespace-nowrap hidden sm:table-cell">NIP</TableHead>
                            <TableHead className="whitespace-nowrap">Name</TableHead>
                            <TableHead className="whitespace-nowrap hidden md:table-cell">Position</TableHead>
                            <TableHead className="whitespace-nowrap hidden lg:table-cell">Email</TableHead>
                            <TableHead className="whitespace-nowrap hidden lg:table-cell">Phone</TableHead>
                            <TableHead className="whitespace-nowrap">Status</TableHead>
                            <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginatedEmployees.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center text-muted-foreground">
                                    No employee found
                                </TableCell>
                            </TableRow>
                        )}
                        {paginatedEmployees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell className="font-medium whitespace-nowrap hidden sm:table-cell">{employee.nik?.trim()}</TableCell>
                                <TableCell className="whitespace-nowrap hidden sm:table-cell">{employee.nip?.trim()}</TableCell>
                                <TableCell className="font-medium whitespace-nowrap">{employee.name}</TableCell>
                                <TableCell className="whitespace-nowrap hidden md:table-cell">{employee.position?.position_name || "-"}</TableCell>
                                <TableCell className="whitespace-nowrap hidden lg:table-cell">{employee.email || "-"}</TableCell>
                                <TableCell className="whitespace-nowrap hidden lg:table-cell">{employee.phone || "-"}</TableCell>
                                <TableCell className="whitespace-nowrap">
                                    <Badge
                                        variant="outline"
                                        className={getBadgeStyles(employee.status?.status_name?.toLowerCase())}
                                    >
                                        {employee.status?.status_name || "-"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                    <div className="flex justify-end gap-2 flex-wrap">
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