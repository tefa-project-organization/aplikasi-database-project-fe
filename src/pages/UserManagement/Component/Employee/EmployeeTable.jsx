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
                <Table className="min-w-[250px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="whitespace-nowrap">Name</TableHead>
                            <TableHead className="whitespace-nowrap hidden sm:table-cell">Position</TableHead>
                            <TableHead className="whitespace-nowrap hidden md:table-cell">Status</TableHead>
                            <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginatedEmployees.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    No employee found
                                </TableCell>
                            </TableRow>
                        )}
                        {paginatedEmployees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell className="font-medium whitespace-nowrap">{employee.name}</TableCell>
                                <TableCell className="whitespace-nowrap hidden sm:table-cell">{employee.position?.position_name || "-"}</TableCell>
                                <TableCell className="whitespace-nowrap hidden md:table-cell">
                                    <Badge
                                        variant="outline"
                                        className={getBadgeStyles(employee.status?.status_name?.toLowerCase())}
                                    >
                                        {employee.status?.status_name || "-"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                    <div className="flex justify-end gap-1 flex-nowrap">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 p-0"
                                            onClick={() => setDetailEmployee(employee)}
                                            title="Detail"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                        </Button>
                                        <AlertDialog open={isDeleteDialogOpen && employeeToDelete?.id === employee.id} onOpenChange={(open) => {
                                            setIsDeleteDialogOpen(open)
                                            if (!open) setEmployeeToDelete(null)
                                        }}>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => setEmployeeToDelete(employee)}
                                                    title="Delete"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
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