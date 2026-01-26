import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TeamCard({ team, onDetail, onEdit, onDelete }) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">
          {team.project_teams_name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {team.project_teams_email}
        </p>
      </CardHeader>

      <CardContent className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Project ID: {team.project_id}
        </span>

        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onDetail}
          >
            Detail
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onEdit}
          >
            Edit
          </Button>

          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={onDelete}
          >
            Hapus
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
