import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, User, FileText, Trash2 } from "lucide-react";

export default function ProjectCard({ project, onDetail, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (value) => {
    if (!value) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

  return (
    <div className="border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-card text-card-foreground overflow-hidden">
      {/* Header */}
      <div
        className={`px-4 py-3 ${
          project.project_type === "FB"
            ? "bg-blue-50 dark:bg-blue-900/30"
            : "bg-green-50 dark:bg-green-900/30"
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-foreground dark:text-foreground truncate">
              {project.project_name}
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">
              #{project.project_code}
            </p>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              project.project_type === "FB"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                : "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
            }`}
          >
            {project.project_type || "N/A"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-center text-sm text-muted-foreground dark:text-muted-foreground">
          <User className="h-4 w-4 mr-2 text-muted-foreground dark:text-muted-foreground" />
          <span>Client: {project.client_name || `Client ${project.client_id}`}</span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground dark:text-muted-foreground">
          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground dark:text-muted-foreground" />
          <span className="font-medium">{formatCurrency(project.contract_value)}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground dark:text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground dark:text-muted-foreground" />
            <div>
              <div className="font-medium">Timeline:</div>
              <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                {formatDate(project.started_at)} - {formatDate(project.finished_at)}
              </div>
            </div>
          </div>
        </div>

        {project.description && (
          <div className="flex items-start text-sm text-muted-foreground dark:text-muted-foreground">
            <FileText className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground dark:text-muted-foreground flex-shrink-0" />
            <p className="line-clamp-2">{project.description}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-100"
            onClick={onDetail}
          >
            Detail
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-foreground dark:hover:text-foreground"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-100"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
