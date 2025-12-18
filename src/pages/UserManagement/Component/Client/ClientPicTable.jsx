// src/pages/UserManagement/Component/Client/ClientPicTable.jsx
import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ClientPicTable({
  allPics = [], // Semua PIC yang tersedia (dari PicTable)
  selectedPicIds = [], // Array ID PIC yang sudah dipilih untuk client ini
  onSelectionChange, // Callback ketika selection berubah
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default per 5 item

  // Validasi data
  const safeAllPics = Array.isArray(allPics) ? allPics : [];
  const safeSelectedIds = Array.isArray(selectedPicIds) ? selectedPicIds : [];

  // Filter berdasarkan search
  const filteredPics = useMemo(
    () =>
      safeAllPics.filter(
        (pic) =>
          pic &&
          pic.name &&
          pic.name.toLowerCase().includes(search.toLowerCase())
      ),
    [safeAllPics, search]
  );

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredPics.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPics = filteredPics.slice(startIndex, endIndex);

  // Handle checkbox change
  const handleCheckboxChange = (picId, checked) => {
    if (onSelectionChange) {
      if (checked) {
        // Tambah PIC
        onSelectionChange([...safeSelectedIds, picId]);
      } else {
        // Hapus PIC
        onSelectionChange(safeSelectedIds.filter((id) => id !== picId));
      }
    }
  };

  // Handle select/deselect all pada halaman ini
  const handleSelectAll = (checked) => {
    if (onSelectionChange) {
      const pagePicIds = paginatedPics.map((pic) => pic.id);
      if (checked) {
        // Gabungkan semua yang ada di halaman ini
        const newSelection = Array.from(
          new Set([...safeSelectedIds, ...pagePicIds])
        );
        onSelectionChange(newSelection);
      } else {
        // Hapus semua yang ada di halaman ini
        const newSelection = safeSelectedIds.filter(
          (id) => !pagePicIds.includes(id)
        );
        onSelectionChange(newSelection);
      }
    }
  };

  // Cek apakah semua PIC di halaman ini terpilih
  const isAllSelected =
    paginatedPics.length > 0 &&
    paginatedPics.every((pic) => safeSelectedIds.includes(pic.id));

  // Reset ke halaman 1 saat search berubah
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Reset ke halaman 1 saat itemsPerPage berubah
  React.useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Assign PIC to Client</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {safeSelectedIds.length} PIC(s) selected
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            • {filteredPics.length} total available
          </span>
        </div>
      </div>

      {/* Search dan Items Per Page */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Input
            placeholder="Search PIC by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {paginatedPics.length} of {filteredPics.length} PICs
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Show:</span>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger className="w-20 h-9">
              <SelectValue placeholder="5" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all PICs on this page"
                  className="dark:border-gray-600"
                />
              </TableHead>
              <TableHead>PIC Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Position</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedPics.length > 0 ? (
              paginatedPics.map((pic) => {
                const isSelected = safeSelectedIds.includes(pic.id);
                return (
                  <TableRow key={pic.id} className={isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(pic.id, checked)
                        }
                        aria-label={`Select ${pic.name}`}
                        className="dark:border-gray-600"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{pic.name || "-"}</span>
                        {isSelected && (
                          <Badge variant="outline" className="text-xs">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{pic.phone || "-"}</TableCell>
                    <TableCell>{pic.email || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={pic.status === "active" ? "default" : "secondary"}
                        className="dark:border-gray-600"
                      >
                        {pic.status || "unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>{pic.position || "-"}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {search ? "No PICs match your search" : "No PICs available"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredPics.length)} of {filteredPics.length} entries
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="dark:border-gray-600"
          >
            Previous
          </Button>
          
          {/* Page numbers - maksimal 5 tombol */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Logika untuk menampilkan halaman yang tepat
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            if (pageNum > 0 && pageNum <= totalPages) {
              return (
                <Button
                  key={pageNum}
                  size="sm"
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-8 h-8 p-0 dark:border-gray-600"
                >
                  {pageNum}
                </Button>
              );
            }
            return null;
          })}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="dark:border-gray-600"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}