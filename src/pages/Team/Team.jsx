import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { apiGet, apiDelete } from "@/lib/api";

// API CONSTANTS
import {
  SHOW_ALL_PROJECT_TEAMS,
  DELETE_PROJECT_TEAM,
} from "@/constants/api/project_teams";
import { SHOW_ALL_PROJECTS } from "@/constants/api/project";

// COMPONENTS
import TeamCard from "./widget/TeamCard";
import TeamForm from "./widget/TeamForm";
import TeamDetail from "./widget/TeamDetail";

export default function Team() {
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  // FORM
  const [openForm, setOpenForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  // DETAIL
  const [openDetail, setOpenDetail] = useState(false);
  const [detailTeamId, setDetailTeamId] = useState(null);

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
  // HANDLERS
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
        await fetchTeams();
        alert("Team berhasil dihapus");
      } else {
        alert(res.message || "Gagal menghapus team");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Terjadi kesalahan server");
    }
  };

  // ===============================
  // FILTER
  // ===============================
  const filteredTeams = useMemo(() => {
    return teams.filter((t) =>
      t.project_teams_name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [teams, search]);

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Project Teams</h1>
        <p className="text-sm text-muted-foreground">
          Kelola team project di sini
        </p>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Cari team..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/3"
        />
        <div className="flex gap-2">
          <Button onClick={handleCreate}>+ Tambah Team</Button>
          <Button variant="outline" onClick={fetchTeams}>
            Refresh
          </Button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {/* GRID */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => {
              const projectName = projects.find(
                (p) => p.id === team.project_id
              )?.project_name;

              return (
                <TeamCard
                  key={team.id}
                  team={team}
                  projectName={projectName}
                  onDetail={() => handleDetail(team.id)}
                  onEdit={() => handleEdit(team)}
                  onDelete={() => handleDelete(team.id)}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Tidak ada team
            </div>
          )}
        </div>
      )}

      {/* FORM */}
      <TeamForm
        open={openForm}
        setOpen={setOpenForm}
        isEdit={isEdit}
        initialData={editingTeam}
        onSuccess={fetchTeams}
      />

      {/* DETAIL */}
      <TeamDetail
        open={openDetail}
        setOpen={setOpenDetail}
        teamId={detailTeamId}
      />
    </div>
  );
}
