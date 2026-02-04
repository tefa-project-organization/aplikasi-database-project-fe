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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import * as Yup from "yup"
import { toast } from "sonner"

const picSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  title: Yup.string().required("Title is required"),
  client_id: Yup.number().required("Client is required"),
  project_id: Yup.number().required("Project is required"),
})

export default function PicForm({ clients = [], projects = [], onSubmit }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    client_id: undefined,
    project_id: undefined,
  })

  const [errors, setErrors] = useState({})

  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const phoneRef = useRef(null)
  const titleRef = useRef(null)
  const clientRef = useRef(null)
  const projectRef = useRef(null)

  const fieldRefs = {
    name: nameRef,
    email: emailRef,
    phone: phoneRef,
    title: titleRef,
    client_id: clientRef,
    project_id: projectRef,
  }

  const [openClientCombobox, setOpenClientCombobox] = useState(false)
  const [openProjectCombobox, setOpenProjectCombobox] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleClientSelect = (clientId) => {
    setForm((prev) => ({ ...prev, client_id: clientId }))
    setOpenClientCombobox(false)
    if (errors.client_id) setErrors((prev) => ({ ...prev, client_id: null }))
  }

  const handleProjectSelect = (projectId) => {
    setForm((prev) => ({ ...prev, project_id: projectId }))
    setOpenProjectCombobox(false)
    if (errors.project_id) setErrors((prev) => ({ ...prev, project_id: null }))
  }

  const handleSubmit = async () => {
    try {
      await picSchema.validate(form, { abortEarly: false })
      setErrors({})

      const payload = {
        name: form.name || "",
        email: form.email || "",
        phone: form.phone || "",
        title: form.title || "",
        client_id: form.client_id ? Number(form.client_id) : null,
        project_id: form.project_id ? Number(form.project_id) : null,
      }

      try {
        await onSubmit?.(payload)
        setForm({
          name: "",
          email: "",
          phone: "",
          title: "",
          client_id: undefined,
          project_id: undefined,
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
        if (index === 0) firstErrorField = err.path
      })

      setErrors(newErrors)
      toast.error("All fields are required")

      if (firstErrorField && fieldRefs[firstErrorField]?.current) {
        try { fieldRefs[firstErrorField].current.focus() } catch (e) {}
      }
    }
  }

  const selectedClient = clients.find(c => c.id === form.client_id)
  const selectedProject = projects.find(p => p.id === form.project_id)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">+ Add PIC</Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm sm:max-w-md overflow-hidden z-50" style={{ scrollbarWidth: "none" }}>
        {/* DialogDescription harus child langsung, biar warning hilang */}
        <DialogDescription className="sr-only">
          Tambahkan Person In Charge baru untuk klien atau proyek.
        </DialogDescription>

        <div className="flex flex-col h-[min(60vh,480px)]">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Add New PIC</DialogTitle>
          </DialogHeader>

          <div className="p-4 pt-0 overflow-y-auto space-y-3 max-h-[calc(60vh-120px)] pr-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
            {/* Name */}
            <div>
              <label className="block mb-1 font-medium">Name * </label>
              <Input
                ref={nameRef}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter PIC name"
                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                required
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">Email *</label>
              <Input
                ref={emailRef}
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter email address"
                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-1 font-medium">Phone *</label>
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

            {/* Title */}
            <div>
              <label className="block mb-1 font-medium">Title *</label>
              <Textarea
                ref={titleRef}
                name="title"
                value={form.title}
                onChange={handleChange}
                rows={2}
                className={`resize-none ${errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                placeholder="PIC title / role"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Client Combobox */}
            <div className="space-y-1">
              <label className="block font-medium">For Client *</label>
              <Popover open={openClientCombobox} onOpenChange={setOpenClientCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    ref={clientRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={openClientCombobox}
                    className={`w-full justify-between ${errors.client_id ? "border-red-500" : ""}`} 
                  >
                    {selectedClient ? selectedClient.name : "Select client..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search client..." />
                    <CommandList>
                      <CommandEmpty>No client found.</CommandEmpty>
                      <CommandGroup>
                        {clients.map((client) => (
                          <CommandItem
                            key={client.id}
                            value={client.name}
                            onSelect={() => handleClientSelect(client.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                form.client_id === client.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {client.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.client_id && <p className="text-red-500 text-xs mt-1">{errors.client_id}</p>}
              {form.client_id && (
                <p className="text-xs text-muted-foreground">
                  Selected: {selectedClient?.name}
                </p>
              )}
            </div>

            {/* Project Combobox */}
            <div className="space-y-1">
              <label className="block font-medium">For Project *</label>
              <Popover open={openProjectCombobox} onOpenChange={setOpenProjectCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    ref={projectRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={openProjectCombobox}
                    className={`w-full justify-between ${errors.project_id ? "border-red-500" : ""}`}
                  >
                    {selectedProject ? selectedProject.name : "Select project..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search project..." />
                    <CommandList>
                      <CommandEmpty>No project found.</CommandEmpty>
                      <CommandGroup>
                        {projects.map((project) => (
                          <CommandItem
                            key={project.id}
                            value={project.name}
                            onSelect={() => handleProjectSelect(project.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                form.project_id === project.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {project.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.project_id && <p className="text-red-500 text-xs mt-1">{errors.project_id}</p>}
              {form.project_id && (
                <p className="text-xs text-muted-foreground">
                  Selected: {selectedProject?.name}
                </p>
              )}
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
