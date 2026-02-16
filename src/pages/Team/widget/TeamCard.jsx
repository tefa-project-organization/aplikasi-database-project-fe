import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Mail, FolderKanban } from "lucide-react";

export default function TeamCard({ team, projectName, onDetail, onEdit, onDelete }) {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border border-indigo-200 dark:border-indigo-700 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full">
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500 opacity-10 rounded-bl-full" />

      <CardHeader className="flex flex-row items-start justify-between pb-2 bg-transparent relative">
        <div className="min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500 shrink-0" />
            <CardTitle className="text-lg leading-tight truncate" title={team.project_teams_name}>
              {team.project_teams_name}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground truncate">
              {team.project_teams_email}
            </p>
          </div>
        </div>
        <span className="shrink-0 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500 text-white">
          Team
        </span>
      </CardHeader>

      <CardContent className="pt-0 relative flex-1 flex flex-col">
        <div className="space-y-3">
          {/* Member count */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10">
              <Users className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                {team.members_count || 0} Anggota
              </span>
            </div>
          </div>

          <div className="flex items-center text-sm">
            <FolderKanban className="h-4 w-4 mr-3 text-muted-foreground shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-muted-foreground leading-none mb-0.5">Project</span>
              <span className="font-medium text-sm truncate">
                {projectName || `Project #${team.project_id}`}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-4">
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full text-[11px] font-medium hover:bg-background/80"
              onClick={onDetail}
            >
              Detail
            </Button>

            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full text-[11px] font-medium hover:bg-background/80"
              onClick={onEdit}
            >
              Edit
            </Button>

            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="w-full text-[11px] font-medium"
              onClick={onDelete}
            >
              Hapus
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
