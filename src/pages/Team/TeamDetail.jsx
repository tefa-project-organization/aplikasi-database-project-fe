import { useParams } from "react-router-dom"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import TeamMemberForm, { TeamFormFooter } from "./TeamMemberForm"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"

// ===== INITIAL DATA =====
const INITIAL_MEMBERS = [
  {
    id: 1,
    teamId: 1,
    name: "Azri",
    role: "Frontend Dev",
    email: "azri@mail.com",
    phone: "08123456789",
  },
  {
    id: 2,
    teamId: 1,
    name: "Bima",
    role: "UI/UX",
    email: "bima@mail.com",
    phone: "08129876543",
  },
  {
    id: 3,
    teamId: 2,
    name: "Rizky",
    role: "Backend Dev",
    email: "rizky@mail.com",
    phone: "08123334444",
  },
  {
    id: 4,
    teamId: 2,
    name: "Adit",
    role: "Database Engineer",
    email: "adit@mail.com",
    phone: "08125556666",
  },
]

export default function TeamDetail() {
  const { id } = useParams()
  const teamId = Number(id)

  const [members, setMembers] = useState(INITIAL_MEMBERS)
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
  })

  const teamMembers = members.filter((m) => m.teamId === teamId)

  const handleSubmit = () => {
    if (!form.name || !form.role) return

    setMembers([
      ...members,
      {
        id: Date.now(),
        teamId,
        ...form,
      },
    ])

    setForm({ name: "", role: "", email: "", phone: "" })
    setOpen(false)
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Detail Team</h2>
          <p className="text-muted-foreground">
            Daftar anggota team
          </p>
        </div>

        {/* ADD MEMBER DIALOG */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>+ Tambah Member</Button>
          </DialogTrigger>

          <DialogContent className="max-w-sm sm:max-w-md p-0">
            <div className="flex flex-col h-[min(70vh,560px)]">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Tambah Member</h3>
              </div>

              <div className="p-4 overflow-auto">
                <TeamMemberForm form={form} setForm={setForm} />
              </div>

              <TeamFormFooter onCancel={() => setOpen(false)} onSubmit={handleSubmit} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABLE */}
      <div className="border rounded-xl bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {teamMembers.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.role}</TableCell>
                <TableCell>{m.email}</TableCell>
                <TableCell>{m.phone}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="destructive">
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {teamMembers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  Belum ada anggota
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}