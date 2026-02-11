import { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FolderKanban,
  Users,
  Briefcase,
  UserCog,
  User,
  TrendingUp,
} from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { apiGet } from "@/lib/api"
import { DASHBOARD_API } from "@/constants/api/dashboard"

const statColors = {
  Projects: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
    iconBg: "bg-blue-500",
    border: "border-blue-200 dark:border-blue-700",
    value: "text-blue-600 dark:text-blue-400",
  },
  Clients: {
    bg: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
    iconBg: "bg-orange-500",
    border: "border-orange-200 dark:border-orange-700",
    value: "text-orange-600 dark:text-orange-400",
  },
  Teams: {
    bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
    iconBg: "bg-purple-500",
    border: "border-purple-200 dark:border-purple-700",
    value: "text-purple-600 dark:text-purple-400",
  },
  PIC: {
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
    iconBg: "bg-emerald-500",
    border: "border-emerald-200 dark:border-emerald-700",
    value: "text-emerald-600 dark:text-emerald-400",
  },
  Employees: {
    bg: "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20",
    iconBg: "bg-pink-500",
    border: "border-pink-200 dark:border-pink-700",
    value: "text-pink-600 dark:text-pink-400",
  },
}

export default function Dashboard() {
  const [stats, setStats] = useState([
    { label: "Projects", icon: FolderKanban, value: 0 },
    { label: "Clients", icon: Briefcase, value: 0 },
    { label: "Teams", icon: Users, value: 0 },
    { label: "PIC", icon: UserCog, value: 0 },
    { label: "Employees", icon: User, value: 0 },
  ])
  const [runningCount, setRunningCount] = useState(0)
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingRunning, setLoadingRunning] = useState(true)

  const fetchDashboard = async () => {
    setLoadingStats(true)
    setLoadingRunning(true)

    const res = await apiGet(DASHBOARD_API)
    if (!res.error && res.data?.data) {
      const d = res.data.data

      setStats([
        { label: "Projects", icon: FolderKanban, value: d.total_projects ?? 0 },
        { label: "Clients", icon: Briefcase, value: d.total_clients ?? 0 },
        { label: "Teams", icon: Users, value: d.total_teams ?? 0 },
        { label: "PIC", icon: UserCog, value: d.total_pic ?? 0 },
        { label: "Employees", icon: User, value: d.total_employees ?? 0 },
      ])
      setRunningCount(d.running_projects ?? 0)
      setLoadingStats(false)
      setLoadingRunning(false)
    } else {
      console.error("Gagal fetch dashboard:", res.message)
      setLoadingStats(false)
      setLoadingRunning(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return (
    <div className="p-6 space-y-6">

      {/* GREETING */}
      <Card className="relative overflow-hidden border border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full" />

        <CardContent className="p-6 relative">
          <h2 className="text-3xl font-semibold tracking-tight mb-1">
            Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Ringkasan aktivitas project hari ini
          </p>
        </CardContent>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {loadingStats
          ? Array(5).fill(0).map((_, i) => (
            <Card
              key={i}
              className="flex justify-center items-center h-28 shadow-sm border border-slate-200 dark:border-slate-800"
            >
              <Spinner />
            </Card>
          ))
          : stats.map((item) => {
            const Icon = item.icon
            const colors = statColors[item.label]
            return (
              <Card
                key={item.label}
                className={`relative overflow-hidden ${colors.bg} ${colors.border} border shadow-sm hover:shadow-md transition-all duration-300 group`}
              >
                <div
                  className={`absolute top-0 right-0 w-20 h-20 ${colors.iconBg} opacity-10 rounded-bl-full`}
                />

                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-transparent">
                  <CardTitle className="text-sm text-muted-foreground font-medium">
                    Jumlah {item.label}
                  </CardTitle>

                  <div
                    className={`rounded-xl ${colors.iconBg} p-2.5 shadow-sm group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-baseline gap-2">
                    <p
                      className={`text-3xl font-bold tracking-tight ${colors.value}`}
                    >
                      {item.value}
                    </p>
                    <TrendingUp className="h-4 w-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
      </div>

      {/* PROJECT STATUS */}
      <Card className="relative overflow-hidden border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full" />

        <CardHeader className="pb-3 bg-transparent relative">
          <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Project Status
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 pb-6 pt-2 relative">
          {loadingRunning ? (
            <div className="flex justify-center items-center h-20">
              <Spinner />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 shadow-sm">
                  <FolderKanban className="h-7 w-7 text-slate-700 dark:text-slate-300" />
                </div>

                <div>
                  <p className="font-semibold">Active Projects</p>
                  <p className="text-sm text-muted-foreground">
                    Currently ongoing projects
                  </p>
                </div>
              </div>

              <div className="text-right">
                <Badge className="text-base px-4 py-1.5 shadow-sm">
                  {runningCount} Running
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
