import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import AdvancedPagination from "@/components/ui/AdvancedPagination";
import { apiGet, apiDelete, apiPost, apiPatch, apiPut } from "@/lib/api";
import { SHOW_ALL_PROJECTS, SHOW_ONE_PROJECT, DELETE_PROJECT, CREATE_PROJECT, UPDATE_PROJECT } from "@/constants/api/project";
import { SHOW_ALL_CLIENTS } from "@/constants/api/clients";

// CHILD COMPONENTS
import FilterControls from "./widget/FilterControls";
import ProjectCard from "./widget/ProjectCard";
import ProjectForm from "./widget/ProjectForm";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All Types");
  const [filterClient, setFilterClient] = useState("All Clients");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const [openDetail, setOpenDetail] = useState(false);
  const [detailProject, setDetailProject] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clients, setClients] = useState([]);

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d.toISOString();
  };

  const [openForm, setOpenForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formProject, setFormProject] = useState({
    project_name: "",
    project_type: "",
    project_code: "",
    client_id: "",
    description: "",
    started_at: "",
    finished_at: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  
  const fetchClients = async () => {
    try {
      const res = await apiGet(SHOW_ALL_CLIENTS);
  
      const items =
        res?.data?.data?.items || [];
  
      setClients(items);
    } catch (err) {
      console.error("Fetch clients error:", err);
      setClients([]);
    }
  };
  
  const clientOptions = useMemo(() => {
    return clients.map((c) => ({
      id: c.id,
      name: c.name, // ✅ ini yang benar
    }));
  }, [clients]);  

  const projectTypes = useMemo(() => {
    const types = projects
      .map((p) => p.project_type)
      .filter(Boolean)
      .filter((type, index, self) => self.indexOf(type) === index);
    return types;
  }, [projects]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await apiGet(SHOW_ALL_PROJECTS);
      const items =
        res?.data?.items || res?.data?.data?.items || res?.items || [];
      setProjects(items);
    } catch (err) {
      setProjects([]);
      console.error("Fetch projects error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  const handleDetail = async (id) => {
    const localProject = projects.find((p) => p.id === id);
    setDetailProject(localProject || null);
    setOpenDetail(true);

    // fetch detail only if description belum ada
    if (!localProject?.description) {
      setDetailLoading(true);
      try {
        const res = await apiGet(SHOW_ONE_PROJECT(id));
        if (!res.error && res.data) {
          setDetailProject(res.data);
        }
      } catch (err) {
        console.error("Detail error:", err);
      }
      setDetailLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const res = await apiDelete(DELETE_PROJECT(id));
      if (!res.error) {
        await fetchProjects();
        setOpenDetail(false);
        alert("Proyek berhasil dihapus!");
      } else {
        alert(`Gagal menghapus: ${res.message}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Terjadi kesalahan saat menghapus proyek");
    }
    setDeleting(false);
  };
    

  const handleEdit = (project) => {
    setIsEdit(true);
    setEditingProjectId(project.id); 
    setFormProject({
      project_name: project.project_name || "",
      project_type: project.project_type || "",
      project_code: project.project_code || "",
      client_id: project.client_id || "",
      description: project.description || "",
      started_at: project.started_at?.split("T")[0] || "",
      finished_at: project.finished_at?.split("T")[0] || "",
    });
    setOpenForm(true);
    setOpenDetail(false);
};


  const handleCreate = () => {
    setIsEdit(false);
    setFormProject({
      project_name: "",
      project_type: "",
      project_code: "",
      client_id: "",
      description: "",
      started_at: "",
      finished_at: "",
    });
    setOpenForm(true);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      // Format data sesuai dengan yang diharapkan backend
      const payload = {
        project_name: String(formData.project_name || "").trim(),
        project_type: String(formData.project_type || ""),
        project_code: String(formData.project_code || "").trim(),
        client_id: parseInt(formData.client_id) || 0,
        description: String(formData.description || ""),
        started_at: parseDate(formData.started_at),
        finished_at: parseDate(formData.finished_at),
      };

      console.log("Payload ke backend:", payload); // Untuk debugging

      let res;
      if (isEdit && editingProjectId) {
        res = await apiPut(
          UPDATE_PROJECT(editingProjectId),
          payload
        );
      } else {
        res = await apiPost(CREATE_PROJECT, payload);
      }


      if (!res.error) {
        await fetchProjects();
        setOpenForm(false);
        alert(`Proyek berhasil ${isEdit ? "diperbarui" : "ditambahkan"}!`);
      } else {
        alert(`Gagal: ${res.message}`);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Terjadi kesalahan");
    }
    setSubmitting(false);
  };

  const filteredProjects = useMemo(() => {
    if (!Array.isArray(projects)) return [];

    return projects.filter((p) => {
      const name = p.project_name || "";
      const desc = p.description || "";
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        desc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClient =
        filterClient === "All Clients" || String(p.client_id) === filterClient;
      const matchesType =
        filterType === "All Types" || p.project_type === filterType;

      let statusMatch = true;
      if (filterStatus !== "All") {
        const now = new Date();
        const finishDate = p.finished_at ? new Date(p.finished_at) : null;

        if (filterStatus === "Active") {
          statusMatch = !finishDate || finishDate > now;
        } else if (filterStatus === "Completed") {
          statusMatch = finishDate && finishDate <= now;
        }
      }

      return matchesSearch && matchesClient && matchesType && statusMatch;
    });
  }, [projects, searchTerm, filterClient, filterType, filterStatus]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatCurrency = (value) => {
    if (!value) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER PAGE */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-muted-foreground">
          Kelola semua project di sini.
        </p>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-card text-card-foreground rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <Input
              placeholder="Cari proyek..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-input text-foreground border-border"
            />
          </div>

          <FilterControls
            filterStatus={filterStatus}
            filterType={filterType}
            filterClient={filterClient}
            clientOptions={clientOptions}
            projectTypes={projectTypes}
            onStatusChange={setFilterStatus}
            onTypeChange={setFilterType}
            onClientChange={setFilterClient}
          />

          <div className="flex gap-2">
            <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary-hover">
              + Tambah Proyek
            </Button>
            <Button variant="outline" onClick={fetchProjects}>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center my-20">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      )}

      {/* Grid Projects */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProjects.length > 0 ? (
            paginatedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDetail={() => handleDetail(project.id)}
                onEdit={() => handleEdit(project)}
                onDelete={() => handleDelete(project.id)}
                clientOptions={clientOptions}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <p>{projects.length === 0 ? "Belum ada proyek" : "Tidak ada proyek yang cocok"}</p>
            </div>
          )}
        </div>
      )}

      {/* PAGINATION */}
      <AdvancedPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="mt-6"
      />

      {/* Detail Dialog - TIDAK MENGGUNAKAN ProjectForm */}
      <Dialog open={openDetail} onOpenChange={setOpenDetail}>
        <DialogContent className="max-w-3xl bg-card text-card-foreground rounded-2xl shadow-2xl max-h-[70vh] overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
          <DialogHeader>
            <DialogTitle>Detail Proyek</DialogTitle>
            <DialogDescription>Informasi lengkap proyek (Read Only)</DialogDescription>
          </DialogHeader>

          {detailLoading && (
            <div className="flex justify-center py-10">
              <Spinner className="h-8 w-8 text-primary" />
            </div>
          )}

          {detailProject && !detailLoading && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nama Proyek</label>
                  <p className="mt-1 text-base font-medium">{detailProject.project_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipe Proyek</label>
                  <p className="mt-1 text-base">{detailProject.project_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Klien</label>
                  <p className="mt-1 text-base">
                     {clients.find(c => c.id === detailProject.client_id)?.name || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nilai Kontrak</label>
                  <p className="mt-1 text-base font-semibold">{formatCurrency(detailProject.contract_value)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tanggal Mulai</label>
                  <p className="mt-1 text-base">{formatDate(detailProject.started_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tanggal Selesai</label>
                  <p className="mt-1 text-base">{formatDate(detailProject.finished_at)}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <label className="text-sm font-medium text-muted-foreground">Deskripsi</label>
                <p className="mt-2 text-base leading-relaxed p-3 bg-muted/30 rounded-lg">
                  {detailProject.description || "-"}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 justify-end mt-6 pt-4 border-t border-border">
            <Button onClick={() => setOpenDetail(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Dialog - MENGGUNAKAN ProjectForm dengan Dialog sendiri */}
      <ProjectForm
        open={openForm}
        setOpen={setOpenForm}
        initialData={formProject}
        onSubmit={handleSubmit}
        submitting={submitting}
        clientOptions={clientOptions}
      />
    </div>
  );
}