// src/pages/UserManagement/Component/PIC/PicTable.jsx
import React, { useState, useMemo } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import PicForm from "./PicForm";
import PicDetail from "./PicDetail";

export default function PicTable({ pics, onAddPic }) {
    const [search, setSearch] = useState("");
    const [sortAsc, setSortAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [detailPic, setDetailPic] = useState(null); // state untuk detail PIC
    const perPage = 10;

    // filter + sort
    const filteredPics = useMemo(() => {
        let filtered = pics.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );
        filtered.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : a.id;
            const dateB = b.createdAt ? new Date(b.createdAt) : b.id;
            return sortAsc ? dateA - dateB : dateB - dateA;
        });
        return filtered;
    }, [pics, search, sortAsc]);

    const totalPages = Math.ceil(filteredPics.length / perPage);
    const paginatedPics = filteredPics.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    // Jika ada PIC yang dipilih, tampilkan detail page
    if (detailPic) {
        return (
            <div className="space-y-6">
                {/* Tombol kembali ke list */}
                <div className="flex justify-between items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDetailPic(null)}
                        className="flex items-center gap-2"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <path d="m15 18-6-6 6-6"/>
                        </svg>
                        Back to PIC List
                    </Button>
                </div>
                
                {/* Detail PIC */}
                <PicDetail 
                    pic={detailPic} 
                    onClose={() => setDetailPic(null)} 
                />
            </div>
        );
    }

    // Tampilkan tabel jika tidak ada PIC yang dipilih
    return (
        <div className="space-y-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">PIC List</h2>
                <PicForm onSubmit={onAddPic} />
            </div>

            {/* SEARCH + SORT */}
            <div className="flex items-center justify-between space-x-2">
                <Input
                    placeholder="Search PIC..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="max-w-xs"
                />
                <Button variant="outline" size="sm" onClick={() => setSortAsc(!sortAsc)}>
                    Sort by Time {sortAsc ? "↑" : "↓"}
                </Button>
            </div>

            {/* TABLE */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>PIC Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginatedPics.map(pic => (
                            <TableRow key={pic.id}>
                                <TableCell className="font-medium">{pic.name}</TableCell>
                                <TableCell>{pic.phone}</TableCell>
                                <TableCell>{pic.email}</TableCell>
                                <TableCell>
                                    <Badge
                                        className="ml-2"
                                        variant={pic.status === "active" ? "default" : "secondary"}
                                    >
                                        {pic.status}
                                    </Badge>
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
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-2">
                <span>
                    Page {currentPage} of {totalPages || 1}
                </span>
                <div className="space-x-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}