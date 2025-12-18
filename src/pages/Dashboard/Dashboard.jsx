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


/* =====================
   DUMMY DATA
===================== */

const stats = [
  {
    label: "Projects",
    icon: FolderKanban,
  },
  {
    label: "Clients",
    icon: Briefcase,
  },
  {
    label: "Teams",
    icon: Users,
  },
  {
    label: "PIC",
    icon: UserCog,
  },
  {
    label: "Employees",
    icon: User,
  },
]


const recentActivities = [
  {
    id: 1,
    title: "Project Baru Dibuat",
    description: "Project Alpha berhasil dibuat",
    time: "2 jam lalu",
    type: "project",
  },
  {
    id: 2,
    title: "Member Ditambahkan",
    description: "Azri ditambahkan ke Team Alpha",
    time: "5 jam lalu",
    type: "team",
  },
  {
    id: 3,
    title: "Status Project Update",
    description: "Project Beta berubah menjadi In Progress",
    time: "1 hari lalu",
    type: "update",
  },
  {
    id: 4,
    title: "Client Baru",
    description: "Client PT Maju Jaya ditambahkan",
    time: "2 hari lalu",
    type: "client",
  },
]

/* =====================
   COMPONENT
===================== */

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* GREETING */}
      <div>
        <h2 className="text-2xl font-bold">
          Dashboard
        </h2>
        <p className="text-muted-foreground">
          Ringkasan aktivitas project hari ini
        </p>
      </div>

     {/* STATS */}
<div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
  {stats.map((item) => {
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
          <p className="text-3xl font-bold">
            {item.value}
          </p>
        </CardContent>
      </Card>
    )
  })}
</div>

      {/* RECENT ACTIVITY (AREA BIRU DI GAMBAR) */}
      <Card>
        <CardHeader>
          <CardTitle>
            Recent Activity
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={activity.id}>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-medium">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>

                <div className="text-right">
                  <Badge variant="secondary">
                    {activity.type}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>

              {index !== recentActivities.length - 1 && (
                <Separator className="my-3" />
              )}
            </div>
          ))}

          {recentActivities.length === 0 && (
            <p className="text-center text-muted-foreground">
              Belum ada aktivitas
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
