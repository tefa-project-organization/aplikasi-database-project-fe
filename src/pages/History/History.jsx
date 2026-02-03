import React, { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiGet } from "@/lib/api"
import { SHOW_ALL_HISTORY } from "@/constants/api/history"
import { SHOW_ALL_CLIENTS } from "@/constants/api/clients"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export default function History() {
  const [logs, setLogs] = useState([])
  const [clientsMap, setClientsMap] = useState({})
  const [detailLog, setDetailLog] = useState(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState("latest") // latest, oldest, az, za
  const [projectType, setProjectType] = useState("ALL") // 'ALL' means all types

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

  const fetchClients = async () => {
    try {
      const res = await apiGet(SHOW_ALL_CLIENTS)
      const items = res?.data?.items || res?.data?.data?.items || res?.items || []
      const map = {}
      items.forEach((c) => (map[c.id] = c.name))
      setClientsMap(map)
    } catch (err) {
      console.error("Fetch clients error:", err)
      setClientsMap({})
    }
  }

  useEffect(() => {
    fetchLogs()
    fetchClients()
  }, [])

  // attach client_name and apply search + sort
  const processed = logs.map((l) => ({ ...l, client_name: clientsMap[l.client_id] || (l.client_id ? `ID: ${l.client_id}` : '-') }))

  // compute unique project types for the filter select
  const projectTypes = Array.from(new Set(processed.map((p) => p.project_type).filter(Boolean))).sort()

  const searched = processed.filter((l) => {
    // filter by selected project type first (projectType === 'ALL' means no filter)
    if (projectType && projectType !== 'ALL') {
      if ((l.project_type || "") !== projectType) return false
    }

    const q = search.toLowerCase()
    return (
      String(l.client_name || "").toLowerCase().includes(q) ||
      (l.project_name || "").toLowerCase().includes(q) ||
      (l.project_code || "").toLowerCase().includes(q) ||
      String(l.client_id).includes(q)
    )
  })

  const sorted = [...searched].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.deleted_at || b.updated_at || b.started_at || 0) - new Date(a.deleted_at || a.updated_at || a.started_at || 0)
    }
    if (sortBy === "oldest") {
      return new Date(a.deleted_at || a.updated_at || a.started_at || 0) - new Date(b.deleted_at || b.updated_at || b.started_at || 0)
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

          {/* Project Type Filter */}
          <Select onValueChange={setProjectType} value={projectType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tipe Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"ALL"}>Semua Tipe</SelectItem>
              {projectTypes.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Project Code</TableHead>
              <TableHead>Project Type</TableHead>
              <TableHead>Finished At</TableHead>
              <TableHead>Deleted At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {displayed.map((log, i) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{(i + 1) + (page - 1) * limit}</TableCell>
                <TableCell>{log.client_name}</TableCell>
                <TableCell>{log.project_name}</TableCell>
                <TableCell>{log.project_code}</TableCell>
                <TableCell>{log.project_type}</TableCell>
                <TableCell>{log.finished_at ? new Date(log.finished_at).toLocaleString() : "-"}</TableCell>
                <TableCell>{log.deleted_at ? new Date(log.deleted_at).toLocaleString() : "-"}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" onClick={() => setDetailLog(log)}>Detail</Button>
                </TableCell>
              </TableRow>
            ))}

            {displayed.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">{loading ? "Loading..." : "No logs found"}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-2">
        <span>Page {page} of {totalPages}</span>
        <div className="space-x-2">
          <Button size="sm" variant="outline" onClick={() => fetchLogs(Math.max(1, page - 1))} disabled={page === 1}>Prev</Button>
          <Button size="sm" variant="outline" onClick={() => fetchLogs(Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next</Button>
        </div>
      </div>

      {/* DETAIL DIALOG */}
      <Dialog open={!!detailLog} onOpenChange={(open) => { if (!open) setDetailLog(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Log Detail</DialogTitle>
          </DialogHeader>

          <div className="p-2">
            {detailLog ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">ID</div><div>{detailLog.id}</div>
                <div className="font-medium">Client ID</div><div>{detailLog.client_id}</div>
                <div className="font-medium">Client Name</div><div>{detailLog.client_name}</div>
                <div className="font-medium">Project Name</div><div>{detailLog.project_name}</div>
                <div className="font-medium">Project Code</div><div>{detailLog.project_code}</div>
                <div className="font-medium">Project Type</div><div>{detailLog.project_type}</div>
                <div className="font-medium">Contract Value</div><div>{detailLog.contract_value ?? '-'}</div>
                <div className="font-medium">Started At</div><div>{detailLog.started_at ? new Date(detailLog.started_at).toLocaleString() : '-'}</div>
                <div className="font-medium">Finished At</div><div>{detailLog.finished_at ? new Date(detailLog.finished_at).toLocaleString() : '-'}</div>
                <div className="font-medium">Deleted At</div><div>{detailLog.deleted_at ? new Date(detailLog.deleted_at).toLocaleString() : '-'}</div>
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
