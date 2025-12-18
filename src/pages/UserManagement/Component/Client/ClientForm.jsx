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

export default function ClientForm({ onSubmit }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    npwp: "",
    status: "active",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    onSubmit?.(form)
    setForm({ name: "", description: "", address: "", phone: "", npwp: "", status: "active" })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">
          + Add Client
        </Button>
      </DialogTrigger>

      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />

      <DialogContent
        className="sm:max-w-md max-w-full overflow-hidden z-50"
        style={{ scrollbarWidth: 'none' }}
      >
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>

        <div 
          className="space-y-2 mt-2 max-h-[70vh] overflow-y-auto pr-2 scrollbar-none [&::-webkit-scrollbar]:hidden"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <Textarea name="description" value={form.description} onChange={handleChange} />
          </div>

          <div>
            <label className="block mb-1 font-medium">Address</label>
            <Textarea name="address" value={form.address} onChange={handleChange} />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <Input name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <div>
            <label className="block mb-1 font-medium">NPWP</label>
            <Input name="npwp" value={form.npwp} onChange={handleChange} />
          </div>

          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
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