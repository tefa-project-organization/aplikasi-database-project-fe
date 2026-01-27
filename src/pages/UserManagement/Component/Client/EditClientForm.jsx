import React, { useState, useEffect } from "react"
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

export default function EditClientForm({ 
  client, 
  onSubmit, 
  getClientById 
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    masked_description: "",
    address: "",
    phone: "",
    npwp: "",
  })

  useEffect(() => {
    if (open && client?.id) {
      loadClientData()
    }
  }, [open, client?.id])

  const loadClientData = async () => {
    setLoading(true)
    try {
      if (client && client.id && client.name) {
        setForm({
          name: client.name || "",
          masked_description: client.masked_description || "",
          address: client.address || "",
          phone: client.phone || "",
          npwp: client.npwp || "",
        })
      } else if (client?.id && getClientById) {
        const clientData = await getClientById(client.id)
        if (clientData) {
          setForm({
            name: clientData.name || "",
            masked_description: clientData.masked_description || "",
            address: clientData.address || "",
            phone: clientData.phone || "",
            npwp: clientData.npwp || "",
          })
        }
      }
    } catch (error) {
      console.error("Error loading client data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!client?.id) return
    const success = await onSubmit?.(client.id, form)
    if (success) {
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-sm sm:max-w-md overflow-hidden z-50"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex flex-col h-[min(60vh,480px)]">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Form untuk mengubah data client
            </DialogDescription>
          </DialogHeader>
          {loading ? (
            <div className="p-8 text-center">
              <p>Loading client data...</p>
            </div>
          ) : (
            <>
              <div className="p-4 pt-0 overflow-y-auto space-y-4 max-h-[calc(60vh-120px)] scrollbar-none [&::-webkit-scrollbar]:hidden">
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
              </div>
              <div className="p-4 border-t bg-background flex justify-end gap-2">
                <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSubmit}>
                  Update
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
