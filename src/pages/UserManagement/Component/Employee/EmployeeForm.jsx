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
  DialogOverlay,
} from "@/components/ui/dialog"

export default function EmployeeForm({ onSubmit }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    nik: "",
    nip: "",
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    position: "",
    status: "active"
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    // Validasi required fields
    if (!form.nik.trim() || !form.nip.trim() || !form.name.trim()) {
      alert("NIK, NIP, and Name are required")
      return
    }

    const payload = {
      nik: form.nik,
      nip: form.nip,
      name: form.name,
      email: form.email,
      password: form.password,
      address: form.address,
      phone: form.phone,
      position: form.position,
      status: form.status
    }

    onSubmit?.(payload)

    // Reset form
    setForm({
      nik: "",
      nip: "",
      name: "",
      email: "",
      password: "",
      address: "",
      phone: "",
      position: "",
      status: "active"
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">+ Add Employee</Button>
      </DialogTrigger>

      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />

      <DialogContent
        className="sm:max-w-md max-w-full overflow-hidden z-50"
        style={{ scrollbarWidth: "none" }}
      >
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2 max-h-[70vh] overflow-y-auto pr-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {/* NIK */}
          <div>
            <label className="block mb-1 font-medium">NIK *</label>
            <Input
              name="nik"
              value={form.nik}
              onChange={handleChange}
              placeholder="Enter NIK"
              required
            />
          </div>

          {/* NIP */}
          <div>
            <label className="block mb-1 font-medium">NIP *</label>
            <Input
              name="nip"
              value={form.nip}
              onChange={handleChange}
              placeholder="Enter NIP"
              required
            />
          </div>

          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Name *</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter employee name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter email address"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <Input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="Enter password"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block mb-1 font-medium">Position</label>
            <Input
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="Enter position"
            />
          </div>

          {/* Address */}
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

          {/* Status */}
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="active">Active</option>
              <option value="resigned">Resigned</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setOpen(false)}
            >
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