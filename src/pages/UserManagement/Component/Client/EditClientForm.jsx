import React, { useState, useEffect, useRef } from "react"
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
import * as Yup from "yup"
import { toast } from "sonner"

const clientSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  masked_description: Yup.string().required("Description is required"),
  address: Yup.string().required("Address is required"),
  phone: Yup.string().required("Phone is required"),
  npwp: Yup.string().required("NPWP is required"),
})

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
  const [errors, setErrors] = useState({})
  
  const nameRef = useRef(null)
  const descRef = useRef(null)
  const addressRef = useRef(null)
  const phoneRef = useRef(null)
  const npwpRef = useRef(null)
  
  const fieldRefs = {
    name: nameRef,
    masked_description: descRef,
    address: addressRef,
    phone: phoneRef,
    npwp: npwpRef,
  }

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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = async () => {
    if (!client?.id) return
    
    try {
      await clientSchema.validate(form, { abortEarly: false })
      setErrors({})
      
      try {
        const success = await onSubmit?.(client.id, form)
        if (success) {
          setOpen(false)
        }
      } catch (error) {
        if (error?.response?.status === 422) {
          toast.error("Data yang dimasukkan tidak valid (422)")
        } else {
          toast.error(error?.message || "Terjadi kesalahan saat menyimpan data")
        }
      }
    } catch (validationError) {
      const newErrors = {}
      let firstErrorField = null
      
      validationError.inner.forEach((err, index) => {
        newErrors[err.path] = err.message
        if (index === 0) {
          firstErrorField = err.path
        }
      })
      
      setErrors(newErrors)
      toast.error("All fields are required")
      
      if (firstErrorField && fieldRefs[firstErrorField]?.current) {
        fieldRefs[firstErrorField].current.focus()
      }
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
                  <label className="block mb-1 font-medium">Name <span className="text-red-500">*</span></label>
                  <Input 
                    ref={nameRef}
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    placeholder="Enter client name" 
                    className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block mb-1 font-medium">Description <span className="text-red-500">*</span></label>
                  <Textarea
                    ref={descRef}
                    name="masked_description"
                    value={form.masked_description}
                    onChange={handleChange}
                    placeholder="Enter description (public description)"
                    className={errors.masked_description ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {errors.masked_description && <p className="text-red-500 text-xs mt-1">{errors.masked_description}</p>}
                </div>
                <div>
                  <label className="block mb-1 font-medium">Address <span className="text-red-500">*</span></label>
                  <Textarea
                    ref={addressRef}
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter client address"
                    className={errors.address ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block mb-1 font-medium">Phone <span className="text-red-500">*</span></label>
                  <Input
                    ref={phoneRef}
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className={errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block mb-1 font-medium">NPWP <span className="text-red-500">*</span></label>
                  <Input
                    ref={npwpRef}
                    name="npwp"
                    value={form.npwp}
                    onChange={handleChange}
                    placeholder="Enter NPWP"
                    className={errors.npwp ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {errors.npwp && <p className="text-red-500 text-xs mt-1">{errors.npwp}</p>}
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
