import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

import * as Yup from "yup";
import { toast } from "sonner";

const teamSchema = Yup.object().shape({
  project_teams_name: Yup.string().required("Nama team wajib diisi"),
  project_teams_email: Yup.string().email("Format email tidak valid").required("Email team wajib diisi"),
  manager_id: Yup.number().typeError("Manager harus dipilih").required("Manager wajib dipilih"),
  project_id: Yup.number().typeError("Project harus dipilih").required("Project wajib dipilih"),
  auditor_id: Yup.number().typeError("Auditor harus dipilih").required("Auditor wajib dipilih"),
});

export default function TeamForm({
  open,
  setOpen,
  isEdit = false,
  initialData = null,
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    project_teams_name: "",
    project_teams_email: "",
    manager_id: "",
    project_id: "",
    auditor_id: "",
  });

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const managerRef = useRef(null);
  const projectRef = useRef(null);
  const auditorRef = useRef(null);

  const fieldRefs = {
    project_teams_name: nameRef,
    project_teams_email: emailRef,
    manager_id: managerRef,
    project_id: projectRef,
    auditor_id: auditorRef,
  };

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
      await teamSchema.validate(form, { abortEarly: false });
      setErrors({});

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
        toast.success(`Team berhasil ${isEdit ? "diperbarui" : "ditambahkan"}`);
      } else {
        toast.error(res.message || "Gagal menyimpan team");
      }
    } catch (validationError) {
      if (validationError.inner) {
        const newErrors = {};
        let firstErrorField = null;

        validationError.inner.forEach((err, index) => {
          newErrors[err.path] = err.message;
          if (index === 0) firstErrorField = err.path;
        });

        setErrors(newErrors);
        toast.error("Semua field wajib diisi dengan benar");

        if (firstErrorField && fieldRefs[firstErrorField]?.current) {
          try { fieldRefs[firstErrorField].current.focus(); } catch (e) { }
        }
      } else {
        console.error("Submit team error:", validationError);
        toast.error("Terjadi kesalahan server");
      }
    }

    setSubmitting(false);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
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
          <DialogDescription>
            {isEdit ? "Perbarui informasi team yang sudah ada." : "Tambahkan team baru ke dalam sistem."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              ref={nameRef}
              placeholder="Nama Team"
              value={form.project_teams_name}
              onChange={(e) => handleChange("project_teams_name", e.target.value)}
              className={errors.project_teams_name ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.project_teams_name && <p className="text-red-500 text-xs mt-1">{errors.project_teams_name}</p>}
          </div>

          <div>
            <Input
              ref={emailRef}
              type="email"
              placeholder="Email Team"
              value={form.project_teams_email}
              onChange={(e) => handleChange("project_teams_email", e.target.value)}
              className={errors.project_teams_email ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.project_teams_email && <p className="text-red-500 text-xs mt-1">{errors.project_teams_email}</p>}
          </div>

          <div>
            <select
              ref={managerRef}
              className={`w-full border rounded-md p-2 bg-background ${errors.manager_id ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              value={form.manager_id}
              onChange={(e) => handleChange("manager_id", e.target.value)}
            >
              <option value="">Pilih Manager</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
            {errors.manager_id && <p className="text-red-500 text-xs mt-1">{errors.manager_id}</p>}
          </div>

          <div>
            <select
              ref={projectRef}
              className={`w-full border rounded-md p-2 bg-background ${errors.project_id ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              value={form.project_id}
              onChange={(e) => handleChange("project_id", e.target.value)}
            >
              <option value="">Pilih Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.project_name}
                </option>
              ))}
            </select>
            {errors.project_id && <p className="text-red-500 text-xs mt-1">{errors.project_id}</p>}
          </div>

          <div>
            <select
              ref={auditorRef}
              className={`w-full border rounded-md p-2 bg-background ${errors.auditor_id ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              value={form.auditor_id}
              onChange={(e) => handleChange("auditor_id", e.target.value)}
            >
              <option value="">Pilih Auditor</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
            {errors.auditor_id && <p className="text-red-500 text-xs mt-1">{errors.auditor_id}</p>}
          </div>
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
