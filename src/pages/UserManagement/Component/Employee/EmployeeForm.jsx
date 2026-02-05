import React, { useState, useRef } from "react"
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
import * as Yup from "yup"
import { toast } from "sonner"

const employeeSchema = Yup.object().shape({
  nik: Yup.string().required("NIK is required"),
  nip: Yup.string().required("NIP is required"),
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email format"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  phone: Yup.string(),
  address: Yup.string(),
  status_id: Yup.number(),
})

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
    status_id: null,
  })
  const [errors, setErrors] = useState({})

  const nikRef = useRef(null)
  const nipRef = useRef(null)
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const phoneRef = useRef(null)
  const addressRef = useRef(null)

  const fieldRefs = {
    nik: nikRef,
    nip: nipRef,
    name: nameRef,
    email: emailRef,
    password: passwordRef,
    phone: phoneRef,
    address: addressRef,
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
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
    if (errors.status_id) {
      setErrors((prev) => ({ ...prev, status_id: null }))
    }
  }

  const handleSubmit = async () => {
    try {
      await employeeSchema.validate(form, { abortEarly: false })
      setErrors({})

      const payload = {
        nik: form.nik.trim(),
        nip: form.nip.trim(),
        name: form.name.trim(),
        email: form.email.trim() || null,
        password: form.password.trim(),
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        status_id: form.status_id,
      }

      try {
        await onSubmit?.(payload)
        setForm({
          nik: "",
          nip: "",
          name: "",
          email: "",
          password: "",
          phone: "",
          address: "",
          status_id: null,
        })
        setOpen(false)
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
        <Button type="button" size="sm">+ Add Employee</Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm sm:max-w-md overflow-hidden z-50" style={{ scrollbarWidth: "none" }}>
        <DialogDescription className="sr-only">
          Tambahkan karyawan baru ke dalam sistem
        </DialogDescription>

        <div className="flex flex-col h-[min(60vh,480px)]">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Form untuk menambahkan karyawan baru ke dalam sistem
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 pt-0 overflow-y-auto space-y-3 max-h-[calc(60vh-120px)] pr-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
            <div>
              <label className="block mb-1 font-medium">NIK <span className="text-red-500">*</span></label>
              <Input 
                ref={nikRef}
                name="nik" 
                value={form.nik} 
                onChange={handleChange} 
                placeholder="Enter NIK" 
                className={errors.nik ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.nik && <p className="text-red-500 text-xs mt-1">{errors.nik}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">NIP <span className="text-red-500">*</span></label>
              <Input 
                ref={nipRef}
                name="nip" 
                value={form.nip} 
                onChange={handleChange} 
                placeholder="Enter NIP" 
                className={errors.nip ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.nip && <p className="text-red-500 text-xs mt-1">{errors.nip}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Name <span className="text-red-500">*</span></label>
              <Input 
                ref={nameRef}
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="Enter employee name" 
                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input 
                ref={emailRef}
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder="Enter email address" 
                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Password <span className="text-red-500">*</span></label>
              <Input
                ref={passwordRef}
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Phone</label>
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
              <label className="block mb-1 font-medium">Address</label>
              <Textarea
                ref={addressRef}
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={2}
                className={`resize-none ${errors.address ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                placeholder="Enter address"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Status</label>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger className={errors.status_id ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="resigned">Resigned</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.status_id && <p className="text-red-500 text-xs mt-1">{errors.status_id}</p>}
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
