import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { apiGet, apiDelete } from "@/lib/api";

// API
import { SHOW_ONE_PROJECT_TEAM } from "@/constants/api/project_teams";
import { SHOW_ALL_EMPLOYEES } from "@/constants/api/employees";

// MODAL ADD / EDIT
import TeamAddMember from "./widget/TeamAddMember";

export default function TeamDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const teamId = Number(id);

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openForm, setOpenForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);


  const [deleteMember, setDeleteMember] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // =========================
  // FETCH TEAM
  // =========================
  const fetchTeam = async () => {
    try {
      const res = await apiGet(SHOW_ONE_PROJECT_TEAM(teamId));
      const data = res?.data?.data;

      setTeam(data || null);
      setMembers(data?.project_team_members || []);
    } catch (err) {
      console.error(err);
      setTeam(null);
      setMembers([]);
    }
  };

  // =========================
  // FETCH EMPLOYEES
  // =========================
  const fetchEmployees = async () => {
    try {
      const res = await apiGet(SHOW_ALL_EMPLOYEES);
      setEmployees(res?.data?.data?.employees || []);
    } catch (err) {
      console.error(err);
      setEmployees([]);
    }
  };

  // =========================
  // EMPLOYEE MAP
  // =========================
  const employeeMap = useMemo(() => {
    return employees.reduce((acc, emp) => {
      acc[Number(emp.id)] = emp;
      return acc;
    }, {});
  }, [employees]);

  const getEmployeeName = (id) => {
    const emp = employeeMap[Number(id)];
    return emp?.employee_name || emp?.name || "-";
  };

  // =========================
  // EFFECT
  // =========================
  useEffect(() => {
    if (!teamId) return;

    const load = async () => {
      setLoading(true);
      await fetchEmployees();
      await fetchTeam();
      setLoading(false);
    };

    load();
  }, [teamId]);

  // =========================
  // HANDLERS
  // =========================
  const handleAddMember = () => {
    setEditingMember(null);   // reset edit
    setOpenForm(true);
  };
  
  const handleEditMember = (member) => {
    setEditingMember(member); // isi data edit
    setOpenForm(true);
  };  

  const handleDeleteMember = (member) => {
    setDeleteMember(member);
    setOpenDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteMember) return;

    setDeleting(true);

    try {
      const res = await apiDelete(
        `/team_members/delete/${deleteMember.id}`
      );

      if (!res?.error) {
        toast.success("Anggota berhasil dihapus");
        fetchTeam();
        setOpenDelete(false);
        setDeleteMember(null);
      } else {
        toast.error(res?.message || "Gagal menghapus anggota");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan server");
    }

    setDeleting(false);
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  // =========================
  // TEAM NOT FOUND
  // =========================
  if (!team) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Team tidak ditemukan</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Kembali
        </Button>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Detail Team</h2>
          <p className="text-muted-foreground text-sm">
            Informasi team & anggota
          </p>
        </div>

        <Button variant="outline" onClick={() => navigate(-1)}>
          Kembali
        </Button>
      </div>

      {/* TEAM INFO */}
      <div className="grid grid-cols-2 gap-4 text-sm border rounded-lg p-4">
        <div>
          <p className="text-muted-foreground">Nama Team</p>
          <p className="font-medium">{team.project_teams_name}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Email</p>
          <p className="font-medium">
            {team.project_teams_email || "-"}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground">Manager</p>
          <p className="font-medium">
            {getEmployeeName(team.manager_id)}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground">Auditor</p>
          <p className="font-medium">
            {getEmployeeName(team.auditor_id)}
          </p>
        </div>
      </div>

      {/* MEMBERS */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Anggota Team</h3>
          <Button size="sm" onClick={handleAddMember}>
            + Tambah Anggota
          </Button>
        </div>
        {members.length > 0 ? (
          <div className="space-y-2">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex justify-between items-center border rounded-md p-3"
              >
                <div>
                  <p className="font-medium">
                    {getEmployeeName(m.employee_id)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {m.role_levels?.role_name} —{" "}
                    {m.role_levels?.level}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <p className="text-xs text-muted-foreground">
                    Rp {m.role_levels?.role_price}
                  </p>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditMember(m)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteMember(m)}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Belum ada anggota
          </p>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      <TeamAddMember
        open={openForm}
        setOpen={setOpenForm}
        teamId={teamId}
        isEdit={!!editingMember}
        initialData={editingMember}
        onSuccess={() => {
          fetchTeam();
          setOpenForm(false);
          setEditingMember(null);
        }}
      />

      {/* DELETE CONFIRM DIALOG */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Hapus Anggota?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus{" "}
              <span className="font-semibold">
                {deleteMember &&
                  getEmployeeName(deleteMember.employee_id)}
              </span>
              ? Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              Batal
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
