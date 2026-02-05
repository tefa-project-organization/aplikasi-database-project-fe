import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function EditDocumentModal({
  open,
  onOpenChange,
  document,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    number: "",
    project_id: "",
    client_id: "",
    document_types: "",
    date_signed: "",
  });

  /* isi data awal */
  useEffect(() => {
    if (document) {
      setForm({
        number: document.number ?? "",
        project_id: document.project_id ?? "",
        client_id: document.client_id ?? "",
        document_types: document.document_types ?? "",
        date_signed: document.date_signed ?? "",
      });
    }
  }, [document]);

  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) =>
      formData.append(k, v)
    );

    if (file) formData.append("document", file);

    try {
      const res = await fetch(
        `https://backend-database-two.vercel.app/api/v1/documents/update/${document.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!res.ok) throw new Error();

      onSuccess?.();
      onOpenChange(false);
    } catch {
      alert("Gagal update dokumen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Dokumen</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Nomor Dokumen</Label>
            <Input
              value={form.number}
              onChange={(e) =>
                setForm({ ...form, number: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Tipe Dokumen</Label>
            <Input
              value={form.document_types}
              onChange={(e) =>
                setForm({
                  ...form,
                  document_types: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Ganti File (opsional)</Label>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
