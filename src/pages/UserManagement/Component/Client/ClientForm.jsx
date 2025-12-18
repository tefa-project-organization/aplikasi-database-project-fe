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
    masked_description: "",
    address: "",
    phone: "",
    npwp: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    onSubmit?.(form)
    setForm({
      name: "",
      masked_description: "",
      address: "",
      phone: "",
      npwp: "",
    })
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
        style={{ scrollbarWidth: "none" }}
      >
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>

        <div
          className="space-y-2 mt-2 max-h-[70vh] overflow-y-auto pr-2 scrollbar-none [&::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter client name"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <Textarea
              name="masked_description"
              value={form.masked_description}
              onChange={handleChange}
              placeholder="Enter description (public description)"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Address</label>
            <Textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter client address"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">NPWP</label>
            <Input
              name="npwp"
              value={form.npwp}
              onChange={handleChange}
              placeholder="Enter NPWP"
            />
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
