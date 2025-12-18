import { useState } from "react"
import { useNavigate } from "react-router-dom"

// shadcn
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

/* =======================
   DUMMY DATA
======================= */

// PROJECT
const PROJECTS = [
  { id: 1, name: "Project 1", pm: "Don Be" },
  { id: 2, name: "Project 2", pm: "Narti" },
  { id: 3, name: "Project 3", pm: "Don Be" },
  { id: 4, name: "Project 4", pm: "Narti" },
]

// TEAM (relasi ke project)
const teams = [
  {
    id: 1,
    name: "Team Alpha",
    description: "Frontend & UI Team",
    membersCount: 2,
    projectId: 1,
  },
  {
    id: 2,
    name: "Team Beta",
    description: "Backend & API Team",
    membersCount: 2,
    projectId: 2,
  },
  {
    id: 3,
    name: "Team Gamma",
    description: "Mobile Development Team",
    membersCount: 3,
    projectId: 3,
  },
  {
    id: 4,
    name: "Team Delta",
    description: "QA & Testing Team",
    membersCount: 1,
    projectId: 4,
  },
]

/* =======================
   COMPONENT
======================= */

export default function Team() {
  const navigate = useNavigate()

  const [filterProject, setFilterProject] = useState("All")
  const [filterPM, setFilterPM] = useState("All")

  /* =======================
     FILTER LOGIC
  ======================= */
  const filteredTeams = teams.filter((team) => {
    const project = PROJECTS.find(
      (p) => p.id === team.projectId
    )

    const matchProject =
      filterProject === "All" ||
      team.projectId === Number(filterProject)

    const matchPM =
      filterPM === "All" ||
      project?.pm === filterPM

    return matchProject && matchPM
  })

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">Daftar Team</h2>
        <p className="text-muted-foreground">
          Kelola team berdasarkan project dan PM
        </p>
      </div>

      {/* FILTER */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* FILTER PROJECT */}
        <Select
          value={filterProject}
          onValueChange={setFilterProject}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filter Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">
              Semua Project
            </SelectItem>
            {PROJECTS.map((p) => (
              <SelectItem
                key={p.id}
                value={String(p.id)}
              >
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* FILTER PM */}
        <Select
          value={filterPM}
          onValueChange={setFilterPM}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filter PM" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">
              Semua PM
            </SelectItem>
            {[...new Set(PROJECTS.map((p) => p.pm))].map(
              (pm) => (
                <SelectItem key={pm} value={pm}>
                  {pm}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      {/* TEAM LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTeams.map((team) => {
          const project = PROJECTS.find(
            (p) => p.id === team.projectId
          )

          return (
            <Card key={team.id}>
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {team.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <p>
                    Project :{" "}
                    <span className="font-medium text-foreground">
                      {project?.name}
                    </span>
                  </p>
                  <p>
                    PM :{" "}
                    <span className="font-medium text-foreground">
                      {project?.pm}
                    </span>
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    {team.membersCount} anggota
                  </span>

                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(`/team/${team.id}`)
                    }
                  >
                    View Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredTeams.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            Tidak ada team yang sesuai filter
          </p>
        )}
      </div>
    </div>
  )
}
