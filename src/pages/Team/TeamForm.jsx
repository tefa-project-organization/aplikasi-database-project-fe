import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { apiGet, apiPost, apiPut } from "@/lib/api";

// API CONSTANTS
import {
  CREATE_PROJECT_TEAM,
  UPDATE_PROJECT_TEAM,
} from "@/constants/api/project_teams";
import { SHOW_ALL_EMPLOYEES } from "@/constants/api/employees";
import { SHOW_ALL_PROJECTS } from "@/constants/api/project";

export default function TeamForm({
  open,
  setOpen,
  isEdit = false,
  initialData = null,
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    project_teams_name: "",
    project_teams_email: "",
    manager_id: "",
    project_id: "",
    auditor_id: "",
  });

  // ===============================
  // FETCH DROPDOWN DATA
  // ===============================
  const fetchEmployees = async () => {
    try {
      const res = await apiGet(SHOW_ALL_EMPLOYEES);
      setEmployees(
        res?.data?.items ||
        res?.data?.data?.items ||
        res?.items ||
        []
      );
    } catch (err) {
      console.error("Fetch employees error:", err);
      setEmployees([]);
    }
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

  // ===============================
  // INIT FORM
  // ===============================
  useEffect(() => {
    if (open) {
      fetchEmployees();
      fetchProjects();

      if (isEdit && initialData) {
        setForm({
          project_teams_name: initialData.project_teams_name || "",
          project_teams_email: initialData.project_teams_email || "",
          manager_id: initialData.manager_id || "",
          project_id: initialData.project_id || "",
          auditor_id: initialData.auditor_id || "",
        });
      } else {
        setForm({
          project_teams_name: "",
          project_teams_email: "",
          manager_id: "",
          project_id: "",
          auditor_id: "",
        });
      }
    }
  }, [open, isEdit, initialData]);

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        project_teams_name: form.project_teams_name.trim(),
        project_teams_email: form.project_teams_email.trim(),
        manager_id: Number(form.manager_id),
        project_id: Number(form.project_id),
        auditor_id: Number(form.auditor_id),
      };

      let res;
      if (isEdit && initialData?.id) {
        res = await apiPut(
          UPDATE_PROJECT_TEAM(initialData.id),
          payload
        );
      } else {
        res = await apiPost(CREATE_PROJECT_TEAM, payload);
      }

      if (!res?.error) {
        onSuccess?.();
        setOpen(false);
        alert(`Team berhasil ${isEdit ? "diperbarui" : "ditambahkan"}`);
      } else {
        alert(res.message || "Gagal menyimpan team");
      }
    } catch (err) {
      console.error("Submit team error:", err);
      alert("Terjadi kesalahan server");
    }

    setSubmitting(false);
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Team" : "Tambah Team"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Nama Team"
            value={form.project_teams_name}
            onChange={(e) =>
              setForm({ ...form, project_teams_name: e.target.value })
            }
            required
          />

          <Input
            type="email"
            placeholder="Email Team"
            value={form.project_teams_email}
            onChange={(e) =>
              setForm({ ...form, project_teams_email: e.target.value })
            }
            required
          />

          <select
            className="w-full border rounded-md p-2 bg-background"
            value={form.manager_id}
            onChange={(e) =>
              setForm({ ...form, manager_id: e.target.value })
            }
            required
          >
            <option value="">Pilih Manager</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>


          {/* PROJECT */}
          <select
            className="w-full border rounded-md p-2 bg-background"
            value={form.project_id}
            onChange={(e) =>
              setForm({ ...form, project_id: e.target.value })
            }
            required
          >
            <option value="">Pilih Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.project_name}
              </option>
            ))}
          </select>

         <select
          className="w-full border rounded-md p-2 bg-background"
          value={form.auditor_id}
          onChange={(e) =>
            setForm({ ...form, auditor_id: e.target.value })
          }
          required
        >
          <option value="">Pilih Auditor</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select> 
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Batal
            </Button>

            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <Spinner className="h-4 w-4" />
              ) : isEdit ? (
                "Update"
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
