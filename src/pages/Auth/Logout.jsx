import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { useAuth } from "@/context/AuthContext.jsx"

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [status, setStatus] = useState("loading"); 
  // loading | success | error

  useEffect(() => {
    const doLogout = async () => {
      try {
        await logout();
        setStatus("success");
      } catch (err) {
        console.error("LOGOUT ERROR:", err);
        setStatus("error");
      }
    };

    doLogout();
  }, [logout]);

  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {status === "success" && "Logout berhasil"}
            {status === "error" && "Logout gagal"}
            {status === "loading" && "Memproses logout"}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {status === "success" &&
              "Anda telah keluar dari sistem."}

            {status === "error" &&
              "Terjadi kesalahan saat logout. Silakan coba lagi."}

            {status === "loading" &&
              "Mohon tunggu sebentar..."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {status !== "loading" && (
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => navigate("/login", { replace: true })}
            >
              Kembali ke Login
            </AlertDialogAction>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
