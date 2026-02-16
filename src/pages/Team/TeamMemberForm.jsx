import React, { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import * as Yup from "yup"

const teamMemberSchema = Yup.object().shape({
  name: Yup.string().required("Nama wajib diisi"),
  role: Yup.string().required("Role wajib diisi"),
  email: Yup.string().email("Format email tidak valid"),
  phone: Yup.string(),
})

export default function TeamMemberForm({ form, setForm }) {
  const [errors, setErrors] = useState({})

  const nameRef = useRef(null)
  const roleRef = useRef(null)
  const emailRef = useRef(null)
  const phoneRef = useRef(null)

  const fieldRefs = {
    name: nameRef,
    role: roleRef,
    email: emailRef,
    phone: phoneRef,
  }

  const handleChange = (key) => (e) => {
    setForm({
      ...form,
      [key]: e.target.value,
    })
    if (errors[key]) {
      setErrors({ ...errors, [key]: null })
    }
  }

  const validate = async () => {
    try {
      await teamMemberSchema.validate(form, { abortEarly: false })
      setErrors({})
      return true
    } catch (validationError) {
      const newErrors = {}
      let firstErrorField = null

      validationError.inner.forEach((err, index) => {
        newErrors[err.path] = err.message
        if (index === 0) firstErrorField = err.path
      })

      setErrors(newErrors)

      if (firstErrorField && fieldRefs[firstErrorField]?.current) {
        fieldRefs[firstErrorField].current.focus()
      }

      return false
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama</Label>
        <Input
          ref={nameRef}
          id="name"
          value={form.name}
          onChange={handleChange("name")}
          placeholder="Enter name"
          className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input
          ref={roleRef}
          id="role"
          value={form.role}
          onChange={handleChange("role")}
          placeholder="Enter role"
          className={errors.role ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          ref={emailRef}
          id="email"
          value={form.email}
          onChange={handleChange("email")}
          placeholder="Enter email"
          className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          ref={phoneRef}
          id="phone"
          value={form.phone}
          onChange={handleChange("phone")}
          placeholder="Enter phone number"
          className={errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>
    </div>
  )
}

export { teamMemberSchema }

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
