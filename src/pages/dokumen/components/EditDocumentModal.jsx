import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { UploadCloud } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";


export default function EditDocumentModal({ open, onOpenChange, onSuccess, initialData }) {
  /* ================= STATE ================= */
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientPics, setClientPics] = useState([]);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});


  useEffect(() => {
    if (initialData) {
      setForm({
        project_id: initialData.project_id || "",
        client_id: initialData.client_id || "",
        client_pic_id: initialData.client_pic_id || "",
        document_types: initialData.document_types || "",
        date_signed: initialData.date_signed
          ? initialData.date_signed.split("T")[0]
          : "",
      });
    }
  }, [initialData]);
  
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
  };

  const validateForm = () => {
    let newErrors = {};
  
    if (!form.project_id) newErrors.project_id = "Project wajib diisi";
    if (!form.client_id) newErrors.client_id = "Client wajib diisi";
    if (!form.client_pic_id) newErrors.client_pic_id = "Client PIC wajib diisi";
    if (!form.document_types) newErrors.document_types = "Tipe dokumen wajib diisi";
    if (!form.date_signed) newErrors.date_signed = "Tanggal wajib diisi";
  
    setErrors(newErrors);
  
    return Object.keys(newErrors).length === 0;
  };
  

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    if (!initialData?.id) {
      setErrorMessage("ID dokumen tidak ditemukan");
      setErrorOpen(true);
      return;
    }
  
    setLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("project_id", form.project_id);
      formData.append("client_id", form.client_id);
      formData.append("client_pic_id", form.client_pic_id);
      formData.append("document_types", form.document_types);
      formData.append("date_signed", form.date_signed);
  
      if (file) {
        formData.append("document", file);
      }
  
      const res = await fetch(
        `https://backend-database-two.vercel.app/api/v1/documents/update/${initialData.id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include"
        }
      );      
  
      const text = await res.text();
  
      let result;
  
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(text);
      }
  
      if (!res.ok) {
        throw new Error(result.message || "Update gagal");
      }
  
      onSuccess?.();
      onOpenChange(false);
  
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };  

  // FETCH API PROJECT
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
  
  // FETCH API CLIENT_PIC
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
      }, 5000);
  
      return () => clearTimeout(timer);
    }
  }, [message]);
  

  /* ================= UI ================= */
  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-xl overflow-hidden">
      <div className="flex flex-col h-[min(90vh,700px)]">

        <DialogHeader>
          <DialogTitle>Edit Dokumen</DialogTitle>

          <DialogDescription>
            Edit informasi dokumen dan upload file jika diperlukan.
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
              {errors.project_id && (
                  <p className="text-sm text-red-500">{errors.project_id}</p>
                )}
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
              {errors.client_id && (
                  <p className="text-sm text-red-500">{errors.client_id}</p>
                )}
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
              {errors.client_pic_id && (
                  <p className="text-sm text-red-500">{errors.client_pic_id}</p>
                )}
            </div>

            {/* Document Type */}
            <div className="space-y-2">
              <Label>Tipe Dokumen</Label>
              <Select
                value={form.document_types}
                onValueChange={(v) =>
                  setForm((prev) => ({
                    ...prev,
                    document_types: v,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Tipe Dokumen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BAST">BAST</SelectItem>
                  <SelectItem value="BA">BA</SelectItem>
                  <SelectItem value="OP">OP</SelectItem>
                </SelectContent>
              </Select>
              {errors.document_types && (
                  <p className="text-sm text-red-500">{errors.document_types}</p>
                )}
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

            {/* File Dokumen */}
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
                {file && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
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
          </div>

          {/* FOOTER */}
          <div className="p-4 border-t bg-background flex gap-3">
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Dokumen"}
            </Button>

            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Batal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    {/* ================= ERROR ALERT ================= */}
    <AlertDialog open={errorOpen} onOpenChange={setErrorOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Gagal Update Dokumen</AlertDialogTitle>
          <AlertDialogDescription>
            {errorMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setErrorOpen(false)}>
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
);
}