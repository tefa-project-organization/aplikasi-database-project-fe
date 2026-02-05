import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Search,
  ArrowUpDown,
  Users,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { apiGet, apiDelete } from "@/lib/api";

// API CONSTANTS
import {
  SHOW_ALL_PROJECT_TEAMS,
  DELETE_PROJECT_TEAM,
} from "@/constants/api/project_teams";
import { SHOW_ALL_PROJECTS } from "@/constants/api/project";

import TeamForm from "./TeamForm"; // Import TeamForm

export default function Team() {
  const navigate = useNavigate();

  // ===============================
  // STATE
  // ===============================
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [openForm, setOpenForm] = useState(false); // State untuk mengontrol form
  

  // ===============================
  // FILTER + SORT
  // ===============================
  const filteredTeams = useMemo(() => {
    const keyword = searchTerm.toLowerCase();

    let result = teams.filter((team) => {
      const name = team?.project_teams_name?.toLowerCase() || "";
      const email = team?.project_teams_email?.toLowerCase() || "";

      return name.includes(keyword) || email.includes(keyword);
    });

    if (sortBy === "az") {
      result.sort((a, b) =>
        (a.project_teams_name || "").localeCompare(b.project_teams_name || "")
      );
    }

    if (sortBy === "za") {
      result.sort((a, b) =>
        (b.project_teams_name || "").localeCompare(a.project_teams_name || "")
      );
    }

    return result;
  }, [teams, searchTerm, sortBy]);

  // ===============================
  // FETCH DATA
  // ===============================
  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await apiGet(SHOW_ALL_PROJECT_TEAMS);
      setTeams(
        res?.data?.items ||
        res?.data?.data?.items ||
        res?.items ||
        []
      );
    } catch (err) {
      console.error("Fetch teams error:", err);
      setTeams([]);
    }
    setLoading(false);
  };

  const fetchProjects = async () => {
    try {
      const res = await apiGet(SHOW_ALL_PROJECTS);
      setProjects(
        res?.data?.items ||
        res?.data?.data?.items ||
        res?.items ||
        []
      );
    } catch (err) {
      console.error("Fetch projects error:", err);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchProjects();
  }, []);

  // ===============================
  // DELETE
  // ===============================
  const handleCreate = () => {
    setOpenDetail(false);
    setDetailTeamId(null);

    setIsEdit(false);
    setEditingTeam(null);
    setOpenForm(true);
  };

  const handleEdit = (team) => {
    setOpenDetail(false);
    setDetailTeamId(null);

    setIsEdit(true);
    setEditingTeam(team);
    setOpenForm(true);
  };

  const handleDetail = (id) => {
    setOpenForm(false);        // ⬅️ INI KUNCI UTAMA
    setIsEdit(false);
    setEditingTeam(null);

    setDetailTeamId(id);
    setOpenDetail(true);
  };



  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus team ini?")) return;

    try {
      const res = await apiDelete(DELETE_PROJECT_TEAM(id));
      if (!res?.error) {
        fetchTeams();
        alert("Team berhasil dihapus");
      } else {
        alert(res.message || "Gagal menghapus team");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server");
    }
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Daftar Team</h2>
        <p className="text-muted-foreground text-sm">
          Lihat dan kelola tim yang tersedia.
        </p>
      </div>

      {/* SEARCH & SORT */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card/40 p-3 rounded-xl border border-border/50">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama tim atau email..."
            className="pl-10 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button
         onClick={() => setOpenForm(true)}
         className="flex items-center gap-2"
        >
         <Plus className="h-4 w-4" />
           Tambah Team
          </Button>


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

      {/* TEAM FORM */}
      <TeamForm
       open={openForm}
       onClose={() => setOpenForm(false)}
       setOpen={setOpenForm}
       projects={projects}
       onSuccess={() => {
       setOpenForm(false);
       fetchTeams();
      }}
      />

      {/* GRID TEAM */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          // 🔵 LOADING SCREEN
          <div className="col-span-full flex flex-col items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">
              Memuat data team...
            </p>
          </div>
        ) : filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <Card
              key={team.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  {team.project_teams_name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {team.project_teams_email}
                </p>
              </CardHeader>

              <CardContent className="flex justify-between items-center border-t pt-4">
                <span className="text-sm font-medium">— Anggota</span>
                <Button
                  size="sm"
                  onClick={() => navigate(`/team/${team.id}`)}
                >
                  Detail
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">
              Tidak ada tim yang ditemukan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
