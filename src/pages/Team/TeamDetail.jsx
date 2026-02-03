import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { apiGet } from "@/lib/api";

// API
import { SHOW_ONE_PROJECT_TEAM } from "@/constants/api/project_teams";
import { SHOW_ALL_EMPLOYEES } from "@/constants/api/employees";

// ADD MEMBER
import TeamAddMember from "./widget/TeamAddMember";

export default function TeamDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const teamId = Number(id);

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

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
    setEmployees(res?.data?.data?.employees || []);
  } catch (err) {
    console.error("Fetch employees error:", err);
    setEmployees([]);
  }
};


  // =========================
  // EMPLOYEE MAP
  // =========================
  const employeeMap = useMemo(() => {
  return employees.reduce((acc, emp) => {
    const key =
      Number(emp.id) ||
      Number(emp.employee_id) ||
      Number(emp.id_employee);

    if (key) {
      acc[key] = emp;
    }

    return acc;
  }, {});
}, [employees]);



  const getEmployeeName = (id) => {
  const key = Number(id);
  if (!key) return "-";

  const emp = employeeMap[key];
  if (!emp) return "-";

  return (
    emp.employee_name ||
    emp.name ||
    emp.full_name ||
    "-"
  );
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
  // RENDER
  // =========================
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

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
          <Button size="sm" onClick={() => setOpenAddMember(true)}>
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

      {/* ADD MEMBER */}
      <TeamAddMember
        open={openAddMember}
        setOpen={setOpenAddMember}
        teamId={teamId}
        onSuccess={fetchTeam}
      />
    </div>
  );
  
}
