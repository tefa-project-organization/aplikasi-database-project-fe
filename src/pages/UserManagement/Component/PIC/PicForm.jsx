// src/pages/UserManagement/Component/PIC/PicForm.jsx
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function PicForm({ onSubmit }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    onSubmit?.(form)
    setForm({ name: "", email: "", phone: "", role: "" })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">+ Add PIC</Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md max-w-full overflow-hidden"
        style={{
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        <DialogHeader>
          <DialogTitle>Add New PIC</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 mt-2 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <Input name="email" value={form.email} onChange={handleChange} />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <Input name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <div>
            <label className="block mb-1 font-medium">Role</label>
            <Input name="role" value={form.role} onChange={handleChange} />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleSubmit}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
