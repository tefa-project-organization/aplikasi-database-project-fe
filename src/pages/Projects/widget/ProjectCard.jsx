import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, DollarSign, User, FileText } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// Warna signature berdasarkan tipe project - Style seperti Dashboard
const getProjectTheme = (projectType) => {
  const themes = {
    FB: {
      bg: "bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20",
      border: "border-violet-200 dark:border-violet-700",
      badge: "bg-violet-500 text-white",
      accent: "text-violet-600 dark:text-violet-400",
      iconBg: "bg-violet-500",
    },
    IT: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      border: "border-blue-200 dark:border-blue-700",
      badge: "bg-blue-500 text-white",
      accent: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-500",
    },
    Construction: {
      bg: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
      border: "border-orange-200 dark:border-orange-700",
      badge: "bg-orange-500 text-white",
      accent: "text-orange-600 dark:text-orange-400",
      iconBg: "bg-orange-500",
    },
    Marketing: {
      bg: "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20",
      border: "border-pink-200 dark:border-pink-700",
      badge: "bg-pink-500 text-white",
      accent: "text-pink-600 dark:text-pink-400",
      iconBg: "bg-pink-500",
    },
    Finance: {
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
      border: "border-emerald-200 dark:border-emerald-700",
      badge: "bg-emerald-500 text-white",
      accent: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-500",
    },
  };

  return themes[projectType] || themes.IT;
};

export default function ProjectCard({ project, clientOptions = [], onDetail, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const clientName =
  clientOptions.find(
    (c) => String(c.id) === String(project.client_id)
  )?.name || "-";

  const formatCurrency = (value) => {
    if (!value) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

  const theme = getProjectTheme(project.project_type);

  return (
    <Card className={`relative overflow-hidden ${theme.bg} ${theme.border} border shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full`}>
      {/* Decorative corner like Dashboard */}
      <div className={`absolute top-0 right-0 w-20 h-20 ${theme.iconBg} opacity-10 rounded-bl-full`} />

      <CardHeader className="flex flex-row items-start justify-between pb-2 bg-transparent relative">
        <div className="min-w-0 flex-1 pr-2">
          <h3 className="font-semibold text-base leading-tight truncate" title={project.project_name}>
            {project.project_name}
          </h3>
          <p className="text-xs mt-1 text-muted-foreground font-mono uppercase tracking-wider">
            {project.project_code}
          </p>
        </div>
        <span className={`shrink-0 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${theme.badge}`}>
          {project.project_type || "N/A"}
        </span>
      </CardHeader>

      <CardContent className="pt-0 relative flex-1 flex flex-col">
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-3 text-muted-foreground shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-muted-foreground leading-none mb-0.5">Client</span>
              <span className="font-medium truncate uppercase text-xs">
                {clientName}
              </span>
            </div>
          </div>

          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 mr-3 text-muted-foreground shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground leading-none mb-0.5">Contract Value</span>
              <span className={`font-semibold ${theme.accent}`}>
                {formatCurrency(project.contract_value)}
              </span>
            </div>
          </div>

          <div className="flex items-start text-sm pt-1">
            <Calendar className="h-4 w-4 mr-3 text-muted-foreground shrink-0 mt-1" />
            <div className="text-xs leading-relaxed">
              <span className="text-[10px] text-muted-foreground block mb-0.5">Timeline</span>
              <span className="font-medium text-foreground/90">
                {formatDate(project.started_at)} — {formatDate(project.finished_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 min-h-[50px]">
          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground line-clamp-2 italic leading-relaxed">
              {project.description ? `"${project.description}"` : "No description provided."}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-4">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-[11px] font-medium hover:bg-background/80"
              onClick={onDetail}
            >
              Detail
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-[11px] font-medium hover:bg-background/80"
              onClick={onEdit}
            >
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full text-[11px] font-medium"
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Hapus Proyek?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Proyek <b>{project.project_name}</b> akan dihapus permanen dan
                    tidak bisa dikembalikan.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>
                    Batal
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-background text-foreground border border-border hover:bg-muted hover:text-foreground rounded-md">
                    Ya, Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}