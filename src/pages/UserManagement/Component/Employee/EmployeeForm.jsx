import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function EmployeeForm({ onSubmit }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    nik: "",
    nip: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    position_id: null,
    department_id: null,
    status_id: null,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    const statusMap = {
      active: 1,
      resigned: 2,
      inactive: 3,
    }

    setForm((prev) => ({
      ...prev,
      status_id: statusMap[value] ?? null,
    }))
  }

  const handleSubmit = () => {
    if (
      !form.nik.trim() ||
      !form.nip.trim() ||
      !form.name.trim() ||
      !form.password.trim()
    ) {
      alert("NIK, NIP, Name, and Password are required")
      return
    }

    const payload = {
      nik: form.nik.trim(),
      nip: form.nip.trim(),
      name: form.name.trim(),
      email: form.email.trim() || null,
      password: form.password.trim(),
      phone: form.phone.trim() || null,
      address: form.address.trim() || null,
      position_id: form.position_id,
      department_id: form.department_id,
      status_id: form.status_id,
    }

    onSubmit?.(payload)

    setForm({
      nik: "",
      nip: "",
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      position_id: null,
      department_id: null,
      status_id: null,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">+ Add Employee</Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm sm:max-w-md overflow-hidden z-50" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col h-[min(60vh,480px)]">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Form untuk menambahkan karyawan baru ke dalam sistem
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 pt-0 overflow-y-auto space-y-3 max-h-[calc(60vh-120px)] pr-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
            <div>
              <label className="block mb-1 font-medium">NIK *</label>
              <Input name="nik" value={form.nik} onChange={handleChange} placeholder="Enter NIK" />
            </div>

            <div>
              <label className="block mb-1 font-medium">NIP *</label>
              <Input name="nip" value={form.nip} onChange={handleChange} placeholder="Enter NIP" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Name *</label>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="Enter employee name" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input name="email" value={form.email} onChange={handleChange} placeholder="Enter email address" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Password *</label>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Enter phone number" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Address</label>
              <Textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={2}
                className="resize-none"
                placeholder="Enter address"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Status</label>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="resigned">Resigned</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-4 border-t bg-background flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
