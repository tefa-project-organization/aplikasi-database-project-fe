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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search,
  ArrowUpDown,
  Users,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"

import { apiGet, apiDelete } from "@/lib/api";

// API CONSTANTS
import {
  SHOW_ALL_PROJECT_TEAMS,
  DELETE_PROJECT_TEAM,
} from "@/constants/api/project_teams";
import { SHOW_ALL_PROJECTS } from "@/constants/api/project";
import { SHOW_ALL_TEAM_MEMBER } from "@/constants/api/project_team_members";

import TeamForm from "./TeamForm"; // Import TeamForm

export default function Team() {
  const navigate = useNavigate();

  // ===============================
  // STATE
  // ===============================
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [openForm, setOpenForm] = useState(false); // State untuk mengontrol form
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  

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
      const [teamsRes, membersRes] = await Promise.all([
        apiGet(SHOW_ALL_PROJECT_TEAMS),
        apiGet(SHOW_ALL_TEAM_MEMBER),
      ]);

      const teamsData =
        teamsRes?.data?.items ||
        teamsRes?.data?.data?.items ||
        teamsRes?.items ||
        [];

      const membersData =
        membersRes?.data?.items ||
        membersRes?.data?.data?.items ||
        membersRes?.items ||
        [];

      // Merge members count ke teams
      const teamsWithMemberCount = teamsData.map((team) => ({
        ...team,
        members_count: membersData.filter(
          (m) => m.project_teams_id === team.id
        ).length,
      }));

      setTeams(teamsWithMemberCount);
      setTeamMembers(membersData);
    } catch (err) {
      console.error("Fetch teams error:", err);
      setTeams([]);
      setTeamMembers([]);
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



  const handleDeleteClick = (team) => {
    setTeamToDelete(team);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!teamToDelete) return;

    try {
      const res = await apiDelete(DELETE_PROJECT_TEAM(teamToDelete.id));
      if (!res?.error) {
        fetchTeams();
        toast.success("Team berhasil dihapus");
      } else {
        toast.error(res.message || "Gagal menghapus team");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan server");
    }
    setDeleteDialogOpen(false);
    setTeamToDelete(null);
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
              className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border border-indigo-200 dark:border-indigo-700 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500 opacity-10 rounded-bl-full" />
              <CardHeader className="relative pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="p-2 bg-indigo-500 rounded-xl shadow-sm shrink-0">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base truncate" title={team.project_teams_name}>
                        {team.project_teams_name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground truncate">
                        {team.project_teams_email}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500 text-white">
                    Team
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-2 relative">
                {/* Member count info */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10">
                    <Users className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                      {team.members_count || 0} Anggota
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-border/40 pt-4">
                  <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    Lihat Detail
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-[11px] font-medium hover:bg-background/80"
                    onClick={() => navigate(`/team/${team.id}`)}
                  >
                    Detail
                  </Button>
                </div>
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

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus team "{teamToDelete?.project_teams_name}"? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTeamToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
