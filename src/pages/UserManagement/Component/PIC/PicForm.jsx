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

  const [openClientCombobox, setOpenClientCombobox] = useState(false)
  const [openProjectCombobox, setOpenProjectCombobox] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleClientSelect = (clientId) => {
    setForm((prev) => ({ ...prev, client_id: clientId }))
    setOpenClientCombobox(false)
  }

  const handleProjectSelect = (projectId) => {
    setForm((prev) => ({ ...prev, project_id: projectId }))
    setOpenProjectCombobox(false)
  }

  const handleSubmit = () => {
    if (!form.name.trim()) {
      alert("Name is required")
      return
    }

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      title: form.title,
      client_id: form.client_id ? Number(form.client_id) : null,
      project_id: form.project_id ? Number(form.project_id) : null,
    }

    onSubmit?.(payload)

    setForm({
      name: "",
      email: "",
      phone: "",
      title: "",
      client_id: undefined,
      project_id: undefined,
    })
    setOpen(false)
  }

  const selectedClient = clients.find(c => c.id === form.client_id)
  const selectedProject = projects.find(p => p.id === form.project_id)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">+ Add PIC</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        {/* DialogDescription harus child langsung, biar warning hilang */}
        <DialogDescription className="sr-only">
          Tambahkan Person In Charge baru untuk klien atau proyek.
        </DialogDescription>

        <DialogHeader>
          <DialogTitle>Add New PIC</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2 max-h-[70vh] overflow-y-auto pr-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Name *</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter PIC name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter email address"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <Textarea
              name="title"
              value={form.title}
              onChange={handleChange}
              rows={2}
              className="resize-none"
              placeholder="PIC title / role"
            />
          </div>

          {/* Client Combobox */}
          <div className="space-y-1">
            <label className="block font-medium">For Client</label>
            <Popover open={openClientCombobox} onOpenChange={setOpenClientCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openClientCombobox}
                  className="w-full justify-between"
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
            {form.client_id && (
              <p className="text-xs text-muted-foreground">
                Selected: {selectedClient?.name}
              </p>
            )}
          </div>

          {/* Project Combobox */}
          <div className="space-y-1">
            <label className="block font-medium">For Project</label>
            <Popover open={openProjectCombobox} onOpenChange={setOpenProjectCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openProjectCombobox}
                  className="w-full justify-between"
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
            {form.project_id && (
              <p className="text-xs text-muted-foreground">
                Selected: {selectedProject?.name}
              </p>
            )}
          </div>

          {/* Buttons */}
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
