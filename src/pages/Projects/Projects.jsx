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
import { Combobox } from "@/components/ui/combobox"

// Field (custom)
import {
  Field,
  FieldLabel,
  FieldContent,
} from "@/components/ui/field"

// --- OPTIONS ---
const STATUS_OPTIONS = [
  { value: "All", label: "Semua Status" },
  { value: "In Progress", label: "In Progress" },
  { value: "Finished", label: "Finished" },
  { value: "Overdue", label: "Overdue" },
]

const PM_OPTIONS = [
  { value: "All PM", label: "Semua PM" },
  { value: "Don Be", label: "Don Be" },
  { value: "Narti", label: "Narti" },
]

// --- MOCK DATA ---
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

  // edit state
  const [isEdit, setIsEdit] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  // detail dialog
  const [openDetail, setOpenDetail] = useState(false)
  const [detailProject, setDetailProject] = useState(null)
  
  const handleDetail = (project) => {
  setDetailProject(project)
  setOpenDetail(true)
}


  // form state
  const [form, setForm] = useState({
    name: "",
    pm: "",
    description: "",
    document: null,
  })

  // FILTER
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

  // EDIT HANDLER
  const handleEdit = (project) => {
    setIsEdit(true)
    setSelectedProject(project)
    setForm({
      name: project.name,
      pm: project.pm,
      description: project.description,
      document: null,
    })
    setOpen(true)
  }

  // RESET FORM
  const resetForm = () => {
    setForm({
      name: "",
      pm: "",
      description: "",
      document: null,
    })
    setIsEdit(false)
    setSelectedProject(null)
  }

  return (
    <div className="p-6">
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

        <Combobox
          value={filterStatus}
          onChange={setFilterStatus}
          options={STATUS_OPTIONS}
          placeholder="Status"
          className="w-[180px]"
        />

        <Combobox
          value={filterPm}
          onChange={setFilterPm}
          options={PM_OPTIONS}
          placeholder="PM"
          className="w-[180px]"
        />

        {/* DIALOG */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
              }}
            >
              + Tambah Proyek
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEdit ? "Edit Proyek" : "Tambah Proyek"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Field>
                <FieldLabel>Nama Proyek</FieldLabel>
                <FieldContent>
                  <Input
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
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Upload Dokumen</FieldLabel>
                <FieldContent>
                  <Input
                    type="file"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        document: e.target.files[0],
                      })
                    }
                  />
                </FieldContent>
              </Field>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  resetForm()
                }}
              >
                Batal
              </Button>
              <Button
                onClick={() => {
                  if (isEdit) {
                    console.log("UPDATE PROYEK:", {
                      id: selectedProject.id,
                      ...form,
                    })
                  } else {
                    console.log("TAMBAH PROYEK:", form)
                  }

                  setOpen(false)
                  resetForm()
                }}
              >
                {isEdit ? "Update" : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* DETAIL DIALOG */}
      <Dialog open={openDetail} onOpenChange={setOpenDetail}>
      <DialogContent className="max-w-9xl w-[98vw] px-18 py-16">
      <DialogHeader>
      <DialogTitle className="text-3xl font-semibold">
        Detail Proyek
      </DialogTitle>
      </DialogHeader>

    {detailProject && (
       <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-10">
        {/* KIRI */}
        <div className="space-y-6">
          <div>
            <p className="text-base text-muted-foreground">Nama Proyek</p>
            <p className="text-lg font-medium">{detailProject.name}</p>
          </div>

          <div>
            <p className="text-base text-muted-foreground">
              Project Manager
            </p>
            <p className="text-lg font-medium">{detailProject.pm}</p>
          </div>

          <div>
            <p className="text-base text-muted-foreground">Status</p>
            <span
              className={`inline-block mt-2 px-4 py-1.5 rounded text-sm font-semibold
                ${
                  detailProject.status === "In Progress"
                    ? "bg-blue-100 text-blue-700"
                    : detailProject.status === "Finished"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
            >
              {detailProject.status}
            </span>
          </div>
        </div>

        {/* KANAN */}
        <div className="space-y-6">
          <div>
            <p className="text-base text-muted-foreground">Deskripsi</p>
            <p className="text-base leading-relaxed">
              {detailProject.description}
            </p>
          </div>

          <div>
            <p className="text-base text-muted-foreground">Dokumen</p>
            <p className="text-base text-muted-foreground">
              Tidak ada dokumen
            </p>
          </div>
        </div>
      </div>
    )}

    <DialogFooter className="mt-14">
      <Button
        className="px-8 py-3 text-base"
        onClick={() => setOpenDetail(false)}
      >
        Tutup
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

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
            <Button size="sm"variant="outline"onClick={() => handleDetail(project)}>
                Detail
              </Button>
              <Button size="sm" onClick={() => handleEdit(project)}>
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
