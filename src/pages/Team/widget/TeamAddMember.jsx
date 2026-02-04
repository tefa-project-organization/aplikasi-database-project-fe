import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

import { apiGet, apiPost, apiPut } from "@/lib/api"
import {
  CREATE_TEAM_MEMBER,
  UPDATE_TEAM_MEMBER,
} from "@/constants/api/project_team_members"
import { SHOW_ALL_EMPLOYEES } from "@/constants/api/employees"
import { SHOW_ALL_ROLE_LEVELS } from "@/constants/api/role_levels"

export default function TeamAddMember({
  open,
  setOpen,
  teamId,
  onSuccess,
}) {
  const isEdit = typeof open === "object" && open?.edit
  const editData = isEdit ? open.data : null

  const [employees, setEmployees] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    employee_id: "",
    role_id: "",
  })

  // ===============================
  // FETCH DATA
  // ===============================
  const fetchData = async () => {
    setLoading(true)
    try {
      const [empRes, roleRes] = await Promise.all([
        apiGet(SHOW_ALL_EMPLOYEES),
        apiGet(SHOW_ALL_ROLE_LEVELS),
      ])

      setEmployees(empRes?.data?.data?.employees || [])
      setRoles(roleRes?.data?.data?.items || [])
    } catch (err) {
      console.error(err)
      setEmployees([])
      setRoles([])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!open) return

    fetchData()

    if (isEdit && editData) {
      setForm({
        employee_id: String(editData.employee_id),
        role_id: String(editData.role_id),
      })
    } else {
      setForm({
        employee_id: "",
        role_id: "",
      })
    }
  }, [open])

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = async () => {
    if (!form.employee_id || !form.role_id) {
      alert("Employee dan Role wajib dipilih")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        project_teams_id: teamId,
        employee_id: Number(form.employee_id),
        role_id: Number(form.role_id),
      }

      const res = isEdit
        ? await apiPut(UPDATE_TEAM_MEMBER(editData.id), payload)
        : await apiPost(CREATE_TEAM_MEMBER, payload)

      if (!res?.error) {
        onSuccess?.()
        setOpen(false)
        alert(`Member berhasil ${isEdit ? "diupdate" : "ditambahkan"}`)
      } else {
        alert(res?.message || "Gagal menyimpan member")
      }
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan server")
    }
    setSubmitting(false)
  }

  // ===============================
  // RENDER
  // ===============================
  return (
    <Dialog open={!!open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base font-semibold">
            {isEdit ? "Edit Anggota Team" : "Tambah Anggota Team"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner className="h-6 w-6" />
          </div>
        ) : (
          <div className="space-y-5">
            {/* EMPLOYEE */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Employee</Label>
              <Select
                value={form.employee_id}
                onValueChange={(v) =>
                  setForm({ ...form, employee_id: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ROLE */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Role</Label>
              <Select
                value={form.role_id}
                onValueChange={(v) =>
                  setForm({ ...form, role_id: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.role_name} — {r.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter className="mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={submitting}
            className="min-w-[100px]"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="min-w-[120px]"
          >
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
