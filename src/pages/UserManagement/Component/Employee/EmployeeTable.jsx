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

export default function EmployeeTable({ employees = [], onAddEmployee, onDetail }) {
    const [search, setSearch] = useState("")
    const [sortAsc, setSortAsc] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [detailEmployee, setDetailEmployee] = useState(null)

    const perPage = 10

    // filter + sort by name
    const filteredEmployees = useMemo(() => {
        let filtered = employees.filter((emp) =>
            emp.name?.toLowerCase().includes(search.toLowerCase()) ||
            emp.nip?.toLowerCase().includes(search.toLowerCase()) ||
            emp.position?.toLowerCase().includes(search.toLowerCase())
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
        const baseStyle = "font-medium text-black dark:text-black" // TEXT HITAM SELALU

        switch (status) {
            case "active":
                return `${baseStyle} bg-blue-400 hover:bg-blue-500 border-blue-500`
            case "resigned":
                return `${baseStyle} bg-red-400 hover:bg-red-500 border-red-500`
            case "inactive":
                return `${baseStyle} bg-gray-300 hover:bg-gray-400 border-gray-400`
            default:
                return `${baseStyle} bg-gray-200 hover:bg-gray-300 border-gray-300`
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
                        {paginatedEmployees.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center text-muted-foreground">
                                    No employee found
                                </TableCell>
                            </TableRow>
                        )}

                        {paginatedEmployees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell className="font-medium">{employee.nik}</TableCell>
                                <TableCell>{employee.nip}</TableCell>
                                <TableCell className="font-medium">{employee.name}</TableCell>
                                <TableCell>{employee.position || "-"}</TableCell>
                                <TableCell>{employee.email || "-"}</TableCell>
                                <TableCell>{employee.phone || "-"}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={getBadgeStyles(employee.status)}
                                    >
                                        {employee.status}
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