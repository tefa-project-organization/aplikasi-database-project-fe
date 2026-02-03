import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
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

export default function UploadDocumentModal({onSuccess}) { 
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); 
  const [message, setMessage] = useState("");

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [form, setForm] = useState({
    number: "",
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

    setLoading(true);
    setStatus("");
    setMessage("");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );
    formData.append("document", file);

    try {
      const res = await fetch("https://backend-database-two.vercel.app/api/v1/documents/create", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      setStatus("success");
      setMessage("Dokumen berhasil diupload");

      onSuccess?.();

      setForm({
        number: "",
        project_id: "",
        client_id: "",
        client_pic_id: "",
        document_types: "",
        date_signed: "",
      });
      setFile(null);
    } catch {
      setStatus("error");
      setMessage("Gagal upload dokumen");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
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
  

  return (
    <div className="p-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button>+ Upload Dokumen</Button>
        </DialogTrigger>

        <DialogContent className="max-w-xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Upload Dokumen</DialogTitle>
            <DialogDescription>
              Lengkapi data sebelum mengunggah dokumen
            </DialogDescription>
          </DialogHeader>

          <Card>
          <CardContent
            className="space-y-6 pt-6 overflow-y-auto pr-2 no-scrollbar"
            style={{ maxHeight: "65vh" }}
          >
              {/* Number */}
              <div className="space-y-1.5">
              <Label>Nomor Dokumen</Label>
              <Input
               placeholder="DOC-010"
               value={form.number}
               onChange={(e) =>
               setForm({ ...form, number: e.target.value })
               }
              />
            </div>

              {/* Project */}
              <div>
                <Label>Project</Label>
                <Select
                  onValueChange={(v) =>
                    setForm({ ...form, project_id: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">Project A</SelectItem>
                    <SelectItem value="25">Project B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Client */}
              <div>
                <Label>Client</Label>
                <Select
                  onValueChange={(v) =>
                    setForm({ ...form, client_id: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">Client ABC</SelectItem>
                    <SelectItem value="3">Client XYZ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Client PIC */}
              <div>
                <Label>Client PIC</Label>
                <Select
                  onValueChange={(v) =>
                    setForm({ ...form, client_pic_id: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih PIC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">John Doe</SelectItem>
                    <SelectItem value="3">Jane Smith</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Document Type */}
              <div>
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
              <div>
                <Label>Tanggal Ditandatangani</Label>
                <Input
                  type="date"
                  value={form.date_signed}
                  onChange={(e) =>
                    setForm({ ...form, date_signed: e.target.value })
                  }
                />
              </div>

              {/* UPLOAD – KLIK + DRAG */}
              <div className="space-y-2 pt-2">
              <Label>File Dokumen</Label>

               <label
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
              className={`flex flex-col items-center justify-center gap-2
              border border-dashed rounded-lg px-6 py-7 cursor-pointer
              transition text-center
             ${
              dragActive
              ? "bg-muted border-primary"
              : "hover:bg-muted"
             }
           `}
           >
           <UploadCloud className="h-8 w-8 text-muted-foreground" />

           <p className="text-sm font-medium">
           {file ? file.name : "Klik atau drag file ke sini"}
           </p>

           <p className="text-xs text-muted-foreground">
              PDF, DOCX, JPG (Max 5MB)
           </p>

           <Input
            type="file"
            className="hidden"
            onChange={(e) =>
            handleFile(e.target.files[0])
          }
          />
          </label>
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

             {/* ACTION */}
             <div className="flex gap-3 pt-2">
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
           
           <Button
            variant="outline"
            className="flex-1"
            onClick={handleCancel}
            disabled={loading}
          >
           Batal
          </Button>
          </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
