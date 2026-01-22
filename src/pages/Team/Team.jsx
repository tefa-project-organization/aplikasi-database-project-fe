import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, ArrowUpDown, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Filter & sort teams
  const filteredTeams = useMemo(() => {
    let result = [...teams].filter((team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === "az") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "za") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [searchTerm, sortBy]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Daftar Team</h2>
        <p className="text-muted-foreground text-sm">Lihat dan kelola tim yang tersedia.</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card/40 p-3 rounded-xl border border-border/50">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari nama tim atau deskripsi..." 
            className="pl-10 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px] bg-background">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Urutkan" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="az">Nama A - Z</SelectItem>
              <SelectItem value="za">Nama Z - A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid Team */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <Card key={team.id} className="w-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  {team.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{team.description}</p>
              </CardHeader>
              <CardContent className="flex justify-between items-center border-t pt-4">
                <span className="text-sm font-medium">{team.members.length} Anggota</span>
                <Button size="sm" onClick={() => navigate(`/team/${team.id}`)}>
                  Detail
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">Tidak ada tim yang ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}