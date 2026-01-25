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
        <Button type="button" size="sm">+ Add Client</Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-sm sm:max-w-md overflow-hidden z-50"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex flex-col h-[min(60vh,480px)]">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Form untuk menambahkan client baru
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 pt-0 overflow-y-auto space-y-4 max-h-[calc(60vh-120px)] scrollbar-none [&::-webkit-scrollbar]:hidden">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="Enter client name" />
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
