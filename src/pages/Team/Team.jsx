import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription // ✅ TAMBAHKAN
} from "@/components/ui/dialog";

// Dummy data
const teams = [
  {
    id: 1,
    name: "Team Alpha",
    description: "Frontend & UI Team",
    projects: ["Project Database", "Project Website"],
    members: [
      { name: "Azri", role: "Frontend Dev" },
      { name: "Bima", role: "UI/UX" },
    ],
  },
  {
    id: 2,
    name: "Team Beta",
    description: "Backend & API Team",
    projects: ["Project Database"],
    members: [
      { name: "Rizky", role: "Backend Dev" },
      { name: "Adit", role: "Database Engineer" },
    ],
  },
];

export default function Team() {
  const [open, setOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Daftar Team</h2>

      {/* Grid Team */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="w-full">
            <CardHeader>
              <CardTitle>{team.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{team.description}</p>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <span className="text-sm">{team.members.length} anggota</span>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedTeam(team);
                  setOpen(true);
                }}
              >
                Detail
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog Detail */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl">
          {selectedTeam && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedTeam.name}</DialogTitle>
                {/* ✅ TAMBAHKAN DIALOG DESCRIPTION */}
                <DialogDescription className="sr-only">
                  Detail informasi tentang tim {selectedTeam.name}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Project yang dikerjakan</h3>
                  <ul className="list-disc list-inside text-sm">
                    {selectedTeam.projects.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Anggota Tim</h3>
                  <ul className="space-y-2 text-sm">
                    {selectedTeam.members.map((m, i) => (
                      <li
                        key={i}
                        className="flex justify-between border rounded-md p-2"
                      >
                        <span>{m.name}</span>
                        <span className="text-muted-foreground">{m.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}