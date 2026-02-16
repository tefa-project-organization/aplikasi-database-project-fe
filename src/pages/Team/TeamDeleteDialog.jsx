import React, { useState, useRef } from "react";
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
import { AlertTriangle } from "lucide-react";
import * as Yup from "yup";
import { toast } from "sonner";

const deleteSchema = Yup.object().shape({
  confirmation: Yup.string()
    .required("Konfirmasi wajib diisi")
    .test("match", 'Ketik "HAPUS" untuk mengkonfirmasi', function (value) {
      return value === "HAPUS";
    }),
});

export default function TeamDeleteDialog({ open, setOpen, team, onConfirm }) {
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState({});
  const [deleting, setDeleting] = useState(false);
  const inputRef = useRef(null);

  const handleClose = () => {
    setConfirmation("");
    setErrors({});
    setOpen(false);
  };

  const handleChange = (e) => {
    setConfirmation(e.target.value);
    if (errors.confirmation) {
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    setDeleting(true);

    try {
      await deleteSchema.validate({ confirmation }, { abortEarly: false });
      setErrors({});

      try {
        await onConfirm?.();
        setConfirmation("");
        setOpen(false);
        toast.success("Team berhasil dihapus");
      } catch (error) {
        toast.error(error?.message || "Gagal menghapus team");
      }
    } catch (validationError) {
      if (validationError.inner) {
        const newErrors = {};
        validationError.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);

        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }

    setDeleting(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <DialogTitle>Konfirmasi Hapus Team</DialogTitle>
          </div>
          <DialogDescription>
            Anda akan menghapus team <strong>{team?.project_teams_name}</strong>. 
            Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Untuk mengkonfirmasi penghapusan, ketik <strong>"HAPUS"</strong> di bawah ini:
          </p>

          <div>
            <Input
              ref={inputRef}
              placeholder='Ketik "HAPUS"'
              value={confirmation}
              onChange={handleChange}
              className={errors.confirmation ? "border-red-500 focus-visible:ring-red-500" : ""}
              disabled={deleting}
            />
            {errors.confirmation && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmation}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={deleting}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleSubmit}
            disabled={deleting || confirmation !== "HAPUS"}
          >
            {deleting ? "Menghapus..." : "Hapus Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
