import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, User, FileText, Trash2, Edit3, Eye } from "lucide-react";
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

  return (
    /* h-full memastikan card mengikuti tinggi row grid tertinggi */
    <div className="group border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-card text-card-foreground overflow-hidden flex flex-col h-full">
      
      {/* Header: Fixed Height area agar judul sejajar */}
      <div
        className={`px-4 py-4 border-b border-border/50 ${
          project.project_type === "FB"
            ? "bg-blue-500/10"
            : "bg-emerald-500/10"
        }`}
      >
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base leading-tight text-foreground truncate" title={project.project_name}>
              {project.project_name}
            </h3>
            <p className="text-xs mt-1 text-muted-foreground font-mono uppercase tracking-wider">
              {project.project_code}
            </p>
          </div>
          <span
            className={`shrink-0 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
              project.project_type === "FB"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
            }`}
          >
            {project.project_type || "N/A"}
          </span>
        </div>
      </div>

      {/* Konten: flex-1 akan mendorong Action Buttons ke bawah */}
      <div className="p-4 flex-1 flex flex-col">
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
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
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

        {/* Area Deskripsi dengan min-height atau padding agar tetap simetris */}
        <div className="mt-4 pt-3 border-t border-border/40 min-h-[50px]">
          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground line-clamp-2 italic leading-relaxed">
              {project.description ? `"${project.description}"` : "No description provided."}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons: Menggunakan Grid agar lebar tombol selalu sama */}
      <div className="p-4 pt-0 mt-auto">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-[11px] font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700"
            onClick={onDetail}
          >
            Detail
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-[11px] font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
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
    </div>
  );
}