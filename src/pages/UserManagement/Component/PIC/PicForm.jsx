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

export default function PicForm({ onSubmit }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    client_id: "",
    project_id: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    if (!form.name.trim()) {
      alert("Name is required")
      return
    }

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      title: form.title,
      client_id: Number(form.client_id),
      project_id: Number(form.project_id),
    }

    onSubmit?.(payload)

    setForm({
      name: "",
      email: "",
      phone: "",
      title: "",
      client_id: "",
      project_id: "",
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">+ Add PIC</Button>
      </DialogTrigger>

      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />

      <DialogContent
        className="sm:max-w-md max-w-full overflow-hidden z-50"
        style={{ scrollbarWidth: "none" }}
      >
        <DialogHeader>
          <DialogTitle>Add New PIC</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 mt-2 max-h-[70vh] overflow-y-auto pr-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Name *</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter PIC name"
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

          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <Textarea
              name="title"
              value={form.title}
              onChange={handleChange}
              rows={2}
              className="resize-none"
              placeholder="PIC title / role"
            />
          </div>

          {/* Client ID */}
          <div>
            <label className="block mb-1 font-medium">For Client</label>
            <Input
              name="client_id"
              value={form.client_id}
              onChange={handleChange}
              placeholder="Client ID"
            />
          </div>

          {/* Project ID */}
          <div>
            <label className="block mb-1 font-medium">For Project</label>
            <Input
              name="project_id"
              value={form.project_id}
              onChange={handleChange}
              placeholder="Project ID"
            />
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