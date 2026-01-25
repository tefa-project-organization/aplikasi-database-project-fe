import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function TeamForm({ form, setForm }) {
  const handleChange = (key) => (e) => {
    setForm({
      ...form,
      [key]: e.target.value,
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama</Label>
        <Input 
            id="name" 
            value={form.name} 
            onChange={handleChange("name")} 
            placeholder="Enter name"
            />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input id="role" 
            value={form.role} 
            onChange={handleChange("role")} 
            placeholder="Enter role"
            />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
            id="email" 
            value={form.email} 
            onChange={handleChange("email")} 
            placeholder="Enter email"
            />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input 
            id="phone" 
            value={form.phone} 
            onChange={handleChange("phone")} 
            placeholder="Enter phone number"
            />
      </div>
    </div>
  )
}

export function TeamFormFooter({ onCancel, onSubmit, isSubmitting = false }) {
  return (
    <div className="border-t p-4 flex justify-end gap-2 bg-background">
      <Button variant="outline" onClick={onCancel}>
        Batal
      </Button>
      <Button onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan..." : "Simpan"}
      </Button>
    </div>
  )
}
