import React, { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { apiGet } from "@/lib/api";

// API
import { SHOW_ONE_PROJECT_TEAM } from "@/constants/api/project_teams";
import { SHOW_ALL_EMPLOYEES } from "@/constants/api/employees";

// ADD MEMBER
import TeamAddMember from "./TeamAddMember";

export default function TeamDetail({ open, setOpen, teamId }) {
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddMember, setOpenAddMember] = useState(false);

  // =========================
  // FETCH TEAM DETAIL
  // =========================
  const fetchTeam = async () => {
    try {
      const res = await apiGet(SHOW_ONE_PROJECT_TEAM(teamId));
      const data = res?.data?.data;

      setTeam(data || null);
      setMembers(data?.project_team_members || []);
    } catch (err) {
      console.error("Fetch team detail error:", err);
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
      setEmployees(res?.data?.data?.items || []);
    } catch (err) {
      console.error("Fetch employees error:", err);
      setEmployees([]);
    }
  };

  // =========================
  // EMPLOYEE LOOKUP MAP (OPTIMAL)
  // =========================
  const employeeMap = useMemo(() => {
    return employees.reduce((acc, emp) => {
      acc[emp.id] = emp;
      return acc;
    }, {});
  }, [employees]);

  const getEmployeeName = (id) => {
    if (!id) return "-";
    return employeeMap[id]?.name || "-";
  };

  // =========================
  // EFFECT
  // =========================
  useEffect(() => {
    if (!open || !teamId) return;

    setLoading(true);
    Promise.all([fetchTeam(), fetchEmployees()]).finally(() =>
      setLoading(false)
    );
  }, [open, teamId]);

  // =========================
  // RENDER
  // =========================
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detail Team</DialogTitle>
            <DialogDescription>
              Informasi team & anggota
            </DialogDescription>
          </DialogHeader>

          {loading && (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          )}

          {!loading && team && (
            <div className="space-y-6 text-sm">
              {/* TEAM INFO */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Nama Team</p>
                  <p className="font-medium">
                    {team.project_teams_name}
                  </p>
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

              <hr />

              {/* MEMBERS */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Anggota Team</h3>
                  <Button
                    size="sm"
                    onClick={() => setOpenAddMember(true)}
                  >
                    + Tambah Anggota
                  </Button>
                </div>

                {members.length > 0 ? (
                  <div className="space-y-2">
                    {members.map((m) => (
                      <div
                        key={m.id}
                        className="flex justify-between items-center border rounded-md p-2"
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

                        <p className="text-xs text-muted-foreground">
                          Rp {m.role_levels?.role_price}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Belum ada anggota
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ADD MEMBER */}
      <TeamAddMember
        open={openAddMember}
        setOpen={setOpenAddMember}
        teamId={teamId}
        onSuccess={fetchTeam}
      />
    </>
  );
}
