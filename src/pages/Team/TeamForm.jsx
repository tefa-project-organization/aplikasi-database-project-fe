import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

import { apiPost } from "@/lib/api";
import { CREATE_PROJECT_TEAM } from "@/constants/api/project_teams";

export default function TeamForm({ open, onClose, projects = [], onSuccess }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    project_teams_name: "",
    project_teams_email: "",
    project_id: "",
    manager_id: "",
    auditor_id: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiPost(CREATE_PROJECT_TEAM, formData);
      if (!res?.error) {
        onSuccess?.();
        setFormData({
          project_teams_name: "",
          project_teams_email: "",
          project_id: "",
          manager_id: "",
          auditor_id: "",
        });
      } else {
        alert(res.message || "Gagal menambah team");
      }
    } catch {
      alert("Terjadi kesalahan server");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-[520px]">
    <DialogHeader className="space-y-1">
      <DialogTitle className="text-lg font-semibold">
        Tambah Team Baru
      </DialogTitle>
      <p className="text-sm text-muted-foreground">
        Isi data team dengan lengkap dan benar.
      </p>
    </DialogHeader>

    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      
      <div className="space-y-3">
        <Label>Nama Team *</Label>
        <Input
          placeholder="Contoh: Team Alpha"
          required
          value={formData.project_teams_name}
          onChange={(e) =>
            setFormData({ ...formData, project_teams_name: e.target.value })
          }
        />
      </div>

      <div className="space-y-3">
        <Label>Email Team *</Label>
        <Input
          type="email"
          placeholder="team@company.com"
          required
          value={formData.project_teams_email}
          onChange={(e) =>
            setFormData({ ...formData, project_teams_email: e.target.value })
          }
        />
      </div>

      <div className="space-y-3">
        <Label>Project *</Label>
        <Select
          value={formData.project_id}
          onValueChange={(val) =>
            setFormData({ ...formData, project_id: val })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id.toString()}>
                {p.project_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Manager ID *</Label>
        <Input
          placeholder="Contoh: 1"
          required
          value={formData.manager_id}
          onChange={(e) =>
            setFormData({ ...formData, manager_id: e.target.value })
          }
        />
      </div>

      <div className="space-y-3">
        <Label>Auditor ID</Label>
        <Input
          placeholder="Opsional"
          value={formData.auditor_id}
          onChange={(e) =>
            setFormData({ ...formData, auditor_id: e.target.value })
          }
        />
      </div>

      <DialogFooter className="flex justify-end gap-2 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
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