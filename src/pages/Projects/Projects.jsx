import React, { useState, useMemo } from "react"

// shadcn UI
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

// Field (custom shadcn-style)
import {
  Field,
  FieldLabel,
  FieldContent,
} from "@/components/ui/field"

import ProjectCard from "@/pages/Projects/widget/ProjectCard"
import FilterControls from "@/pages/Projects/widget/FilterControls"
import SearchBar from "@/pages/Projects/widget/SearchBar"

// --- Mock Data ---
const MOCK_PROJECTS = [
  { id: 1, name: "Project 1", description: "lorem ipsum dolor sit amet.", status: "In Progress", pm: "Don Be" },
  { id: 2, name: "Project 2", description: "lorem ipsum dolor sit amet.", status: "Finished", pm: "Narti" },
  { id: 3, name: "Project 3", description: "lorem ipsum dolor sit amet.", status: "Overdue", pm: "Don Be" },
  { id: 4, name: "Project 4", description: "Deskripsi proyek penting.", status: "In Progress", pm: "Narti" },
]

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterPm, setFilterPm] = useState("All PM")

  // dialog state
  const [open, setOpen] = useState(false)

  // form state
  const [form, setForm] = useState({
    name: "",
    pm: "",
    description: "",
  })

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        filterStatus === "All" || project.status === filterStatus

      const matchesPm =
        filterPm === "All PM" || project.pm === filterPm

      return matchesSearch && matchesStatus && matchesPm
    })
  }, [searchTerm, filterStatus, filterPm])

  return (
    <div className="p-6">
      {/* HEADER */}
      <h2 className="text-xl font-bold mb-6">Daftar Proyek</h2>

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div className="flex-grow">
          <Input
            placeholder="Cari proyek..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <FilterControls
          filterStatus={filterStatus}
          filterPm={filterPm}
          onStatusChange={setFilterStatus}
          onPmChange={setFilterPm}
        />

        {/* BUTTON + DIALOG */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="whitespace-nowrap">
              + Tambah Proyek
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Proyek</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Field>
                <FieldLabel>Nama Proyek</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="Nama proyek"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Project Manager</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="Nama PM"
                    value={form.pm}
                    onChange={(e) =>
                      setForm({ ...form, pm: e.target.value })
                    }
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Deskripsi</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="Deskripsi proyek"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </FieldContent>
              </Field>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button
                onClick={() => {
                  console.log("DATA PROYEK:", form)
                  setForm({ name: "", pm: "", description: "" })
                  setOpen(false)
                }}
              >
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* PROJECT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>PM: {project.pm}</CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>

              <span
                className={`inline-block mt-3 text-xs font-medium px-2 py-1 rounded
                  ${project.status === "Finished" && "bg-green-100 text-green-700"}
                  ${project.status === "In Progress" && "bg-blue-100 text-blue-700"}
                  ${project.status === "Overdue" && "bg-red-100 text-red-700"}
                `}
              >
                {project.status}
              </span>
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
              <Button size="sm" variant="outline">
                Detail
              </Button>
              <Button size="sm">
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}

        {filteredProjects.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            Tidak ada proyek yang cocok dengan pencarian / filter.
          </p>
        )}
      </div>
    </div>
  )
}
