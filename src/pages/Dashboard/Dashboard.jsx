import { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  FolderKanban,
  Users,
  Briefcase,
  UserCog,
  User,
} from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { apiGet } from "@/lib/api"
import { DASHBOARD_API } from "@/constants/api/dashboard"

export default function Dashboard() {
  const [stats, setStats] = useState([
    { label: "Projects", icon: FolderKanban, value: 0 },
    { label: "Clients", icon: Briefcase, value: 0 },
    { label: "Teams", icon: Users, value: 0 },
    { label: "PIC", icon: UserCog, value: 0 },
    { label: "Employees", icon: User, value: 0 },
  ])
  const [runningProjects, setRunningProjects] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingProjects, setLoadingProjects] = useState(true)

  const fetchDashboard = async () => {
    setLoadingStats(true)
    setLoadingProjects(true)

    const res = await apiGet(DASHBOARD_API)
    if (!res.error && res.data?.data) {
      const d = res.data.data

      // update stats
      setStats([
        { label: "Projects", icon: FolderKanban, value: d.total_projects ?? 0 },
        { label: "Clients", icon: Briefcase, value: d.total_clients ?? 0 },
        { label: "Teams", icon: Users, value: d.total_teams ?? 0 },
        { label: "PIC", icon: UserCog, value: d.total_pic ?? 0 },
        { label: "Employees", icon: User, value: d.total_employees ?? 0 },
      ])
      setLoadingStats(false)

      // update running projects
      setRunningProjects([
        {
          id: 1,
          title: "Dummy 1",
          description: `${d.running_projects ?? 0} project sedang berjalan`,
          time: "67",
          type: "project",
        },
      ])
      setLoadingProjects(false)
    } else {
      console.error("Gagal fetch dashboard:", res.message)
      setLoadingStats(false)
      setLoadingProjects(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* GREETING */}
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">
          Ringkasan aktivitas project hari ini
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {loadingStats
          ? Array(5).fill(0).map((_, i) => (
              <Card key={i} className="flex justify-center items-center h-28">
                <Spinner />
              </Card>
            ))
          : stats.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.label} className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm text-muted-foreground">
                      Jumlah {item.label}
                    </CardTitle>
                    <div className="rounded-xl bg-primary/10 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{item.value}</p>
                  </CardContent>
                </Card>
              )
            })}
      </div>

      {/* RUNNING PROJECTS */}
      <Card>
        <CardHeader>
          <CardTitle>Running Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingProjects ? (
            <div className="flex justify-center items-center h-20">
              <Spinner />
            </div>
          ) : runningProjects.length > 0 ? (
            runningProjects.map((item, index) => (
              <div key={item.id}>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{item.type}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.time}
                    </p>
                  </div>
                </div>
                {index !== runningProjects.length - 1 && (
                  <Separator className="my-3" />
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              Belum ada project berjalan
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
