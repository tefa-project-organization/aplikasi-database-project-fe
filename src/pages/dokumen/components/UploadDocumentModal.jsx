import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadCloud, Loader2 } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";

export default function UploadDocumentModal({ onSuccess, onError }) {
  /* ================= STATE ================= */
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientPics, setClientPics] = useState([]);

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [form, setForm] = useState({
    project_id: "",
    client_id: "",
    client_pic_id: "",
    document_types: "",
    date_signed: "",
  });

  /* ================= FILE HANDLER ================= */
  const handleFile = (selected) => {
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      setStatus("error");
      setMessage("Ukuran file maksimal 5MB");
      return;
    }

    setFile(selected);
    setStatus("");
    setMessage("");
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!file) {
      setStatus("error");
      setMessage("File belum dipilih");
      return;
    }

    if (
      !form.project_id ||
      !form.client_id ||
      !form.client_pic_id ||
      !form.document_types ||
      !form.date_signed
    ) {
      setStatus("error");
      setMessage("Semua field wajib diisi");
      return;
    }
    
    setLoading(true);
    setStatus("");
    setMessage("");
  const formData = new FormData();
    formData.append("project_id", form.project_id);
    formData.append("client_id", form.client_id);
    formData.append("client_pic_id", form.client_pic_id);
    formData.append("document_types", form.document_types);
    formData.append("date_signed", form.date_signed);
    formData.append("document", file);
  
    try {
      const res = await fetch(
        "https://backend-database-two.vercel.app/api/v1/documents/create",
        {
          method: "POST",
          body: formData,
        }
      );
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Gagal upload dokumen");
      }
  
      setStatus("success");
      setMessage("Dokumen berhasil diupload");

      onSuccess?.("Dokumen berhasil disimpan");

      // tutup modal
      setTimeout(() => {
        setOpen(false);
        resetForm();
      }, 300);

    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Gagal upload dokumen");
    } finally {
      setLoading(false);
    }
  };
  
  /* ================= RESET ================= */
  const resetForm = () => {
    setFile(null);
    setStatus("");
    setMessage("");
    setLoading(false);

    setForm({
      number: "",
      project_id: "",
      client_id: "",
      client_pic_id: "",
      document_types: "",
      date_signed: "",
    });
  };
// FETCH PROJECT API
useEffect(() => {
  const fetchProjects = async () => {
    try {
      const response = await fetch("https://backend-database-two.vercel.app/api/v1/projects/show-all");
      const data = await response.json();

      if (data.status) {
        setProjects(data.data.items); // Simpan daftar project ke state
      } else {
        console.error("Gagal mengambil data project");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  fetchProjects();
}, []);

// FETCH API CLIENT 
useEffect(() => {
  const fetchClients = async () => {
    try {
      const response = await fetch("https://backend-database-two.vercel.app/api/v1/clients/show-all");
      const data = await response.json();

      if (data.status) {
        setClients(data.data.items); // Simpan daftar client ke state
      } else {
        console.error("Gagal mengambil data client");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  fetchClients();
}, []);

// FETCh API CLIENT_PIC
useEffect(() => {
  const fetchClientPics = async () => {
    try {
      const response = await fetch("https://backend-database-two.vercel.app/api/v1/client_pics/show-all");
      const data = await response.json();

      if (data.status) {
        setClientPics(data.data.items); // Simpan daftar Client PIC ke state
      } else {
        console.error("Gagal mengambil data Client PIC");
      }
    } catch (error) {
      console.error("Error fetching Client PICs:", error);
    }
  };

  fetchClientPics();
}, []);

useEffect(() => {
  if (message) {
    const timer = setTimeout(() => {
      setMessage("");
      setStatus("");
    }, 5000); // 5000ms = 5 detik

    return () => clearTimeout(timer);
  }
}, [message]);


  /* ================= UI ================= */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Upload Dokumen</Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl overflow-hidden">
        <div className="flex flex-col h-[min(90vh,700px)]">
          {/* HEADER */}
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-lg">Upload Dokumen</DialogTitle>
            <DialogDescription>
              Lengkapi data sebelum mengunggah dokumen
            </DialogDescription>
          </DialogHeader>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto space-y-6 p-6 scrollbar-none [&::-webkit-scrollbar]:hidden">

            {/* Project */}
            <div className="space-y-2">
              <Label>Project</Label>
              <Select
                value={form.project_id}
                onValueChange={(v) => setForm({ ...form, project_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                 <SelectItem key={project.id} value={project.id}>
                   {project.project_name} ({project.project_code})
                 </SelectItem>
                 
                  ))}
                </SelectContent>
              </Select>
            </div>

           {/* Client */}
            <div className="space-y-2">
              <Label>Client</Label>
              <Select
                value={form.client_id}
                onValueChange={(v) => setForm({ ...form, client_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Client PIC */}
            <div className="space-y-2">
              <Label>Client PIC</Label>
              <Select
                value={form.client_pic_id}
                onValueChange={(v) => setForm({ ...form, client_pic_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Client PIC" />
                </SelectTrigger>
                <SelectContent>
                  {clientPics.map((pic) => (
                    <SelectItem key={pic.id} value={pic.id}>
                      {pic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Document Type */}
            <div className="space-y-2">
              <Label>Tipe Dokumen</Label>
              <Select
                onValueChange={(v) =>
                  setForm({ ...form, document_types: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Tipe Dokumen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BAST">BAST</SelectItem>
                  <SelectItem value="MOU">MOU</SelectItem>
                  <SelectItem value="CONTRACT">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>Tanggal Ditandatangani</Label>
              <Input
                type="date"
                value={form.date_signed}
                onChange={(e) =>
                  setForm({ ...form, date_signed: e.target.value })
                }
              />
            </div>

            <div className="space-y-2 pt-2">
              <Label>File Dokumen</Label>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  handleFile(e.dataTransfer.files[0]);
                }}
                className={`relative flex flex-col items-center justify-center gap-2
                  border border-dashed rounded-lg px-6 py-7 cursor-pointer
                  transition text-center
                  ${
                    dragActive
                      ? "bg-muted border-primary"
                      : "hover:bg-muted"
                  }`}
                onClick={() => document.getElementById("file-upload").click()}
              >
                {/* TOMBOL X */}
                {file && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetForm();
                    }}
                  >
                    ✕
                  </Button>
                )}

                <UploadCloud className="h-8 w-8 text-muted-foreground" />

                <p className="text-sm font-medium">
                  {file ? file.name : "Klik atau drag file ke sini"}
                </p>

                <p className="text-xs text-muted-foreground">
                  PDF, DOCX, (Max 5MB)
                </p>

                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>
            </div>

            {/* STATUS */}
            {message && (
              <p
                className={`text-sm text-center ${
                  status === "success"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-4 border-t bg-background flex gap-3">
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Dokumen"
              )}
            </Button>

            <DialogClose asChild>
            <Button
              variant="outline"
              className="flex-1"
              onClick={resetForm}
              disabled={loading}
            >
              Batal
            </Button>
          </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}