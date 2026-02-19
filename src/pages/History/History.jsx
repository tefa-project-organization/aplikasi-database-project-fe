import React, { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiGet } from "@/lib/api"
import { SHOW_ALL_HISTORY } from "@/constants/api/history"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AdvancedPagination from "@/components/ui/AdvancedPagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export default function History() {
  const [logs, setLogs] = useState([])
  const [detailLog, setDetailLog] = useState(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState("latest")

  const fetchLogs = async (p = 1) => {
    setLoading(true)
    try {
      const res = await apiGet(SHOW_ALL_HISTORY, { page: p, limit })
      const items = res?.data?.items || res?.data?.data?.items || res?.items || []
      const total = res?.data?.total_pages || res?.data?.data?.total_pages || 1
      setLogs(items)
      setTotalPages(total)
      setPage(p)
    } catch (err) {
      console.error("Fetch logs error:", err)
      setLogs([])
      setTotalPages(1)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  // Map log data to table structure
  const processed = logs.map((l) => {
    return {
      ...l,
      id: l.log_id,
      entity: l.event_description || '-',
      action: l.action,
      timestamp: l.log_dates,
      raw_data: l
    }
  })

  const searched = processed.filter((l) => {
    const q = search.toLowerCase()
    return (
      String(l.entity).toLowerCase().includes(q) ||
      String(l.action).toLowerCase().includes(q) ||
      String(l.id).includes(q)
    )
  })

  const sorted = [...searched].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
    }
    if (sortBy === "oldest") {
      return new Date(a.timestamp || 0) - new Date(b.timestamp || 0)
    }
    return 0
  })

  const displayed = sorted

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">History Logs</h2>
        <div className="flex items-center gap-2">
          <Input placeholder="Search log..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />



          <Select onValueChange={setSortBy} value={sortBy}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Terbaru</SelectItem>
              <SelectItem value="oldest">Terlama</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[700px] md:min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap hidden sm:table-cell">No.</TableHead>
              <TableHead className="whitespace-nowrap">Entity</TableHead>
              <TableHead className="whitespace-nowrap hidden md:table-cell">Action</TableHead>
              <TableHead className="whitespace-nowrap hidden lg:table-cell">Timestamp</TableHead>
              <TableHead className="text-right whitespace-nowrap">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {displayed.map((log, i) => (
              <TableRow key={`${log.id}-${i}`}>
                <TableCell className="font-medium whitespace-nowrap hidden sm:table-cell">{(i + 1) + (page - 1) * limit}</TableCell>
                <TableCell className="whitespace-nowrap">{log.entity}</TableCell>
                <TableCell className="whitespace-nowrap hidden md:table-cell">{log.action}</TableCell>
                <TableCell className="whitespace-nowrap hidden lg:table-cell">{log.timestamp ? new Date(log.timestamp).toLocaleString() : "-"}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button size="sm" variant="outline" onClick={() => setDetailLog(log)}>Detail</Button>
                </TableCell>
              </TableRow>
            ))}

            {displayed.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">{loading ? "Loading..." : "No logs found"}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AdvancedPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={fetchLogs}
        className="mt-4"
      />

      {/* DETAIL DIALOG */}
      <Dialog open={!!detailLog} onOpenChange={(open) => { if (!open) setDetailLog(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Log Detail</DialogTitle>
            <DialogDescription>
              Detail perubahan data untuk log ID {detailLog?.id}
            </DialogDescription>
          </DialogHeader>

          <div className="p-2 max-h-[60vh] overflow-y-auto no-scrollbar">
            {detailLog ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Log ID</div><div>{detailLog.id}</div>
                  <div className="font-medium">Entity</div><div>{detailLog.raw_data?.event_description}</div>
                  <div className="font-medium">Action</div><div>{detailLog.action}</div>
                  <div className="font-medium">Timestamp</div><div>{detailLog.raw_data?.log_dates ? new Date(detailLog.raw_data.log_dates).toLocaleString() : '-'}</div>
                </div>

                {detailLog.raw_data?.old_data_change && Object.keys(detailLog.raw_data.old_data_change).length > 0 && (
                  <div>
                    <div className="font-medium mb-2">Old Data:</div>
                    <div className="text-sm space-y-1">
                      {Object.entries(detailLog.raw_data.old_data_change).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 gap-2">
                          <span className="text-muted-foreground">{key}:</span>
                          <span>{value === null ? 'null' : String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {detailLog.raw_data?.new_data_change && Object.keys(detailLog.raw_data.new_data_change).length > 0 && (
                  <div>
                    <div className="font-medium mb-2">New Data:</div>
                    <div className="text-sm space-y-1">
                      {Object.entries(detailLog.raw_data.new_data_change).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 gap-2">
                          <span className="text-muted-foreground">{key}:</span>
                          <span>{value === null ? 'null' : String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button onClick={() => setDetailLog(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
