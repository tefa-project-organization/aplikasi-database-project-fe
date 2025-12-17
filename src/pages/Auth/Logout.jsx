import React, { useEffect, useState, useRef } from "react";
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
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    if (hasLoggedOut.current) return;
    hasLoggedOut.current = true;

    const performLogout = async () => {
      try {
        await logout();
        setStatus("success");
        
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
        
      } catch (err) {
        setStatus("error");
        
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      }
    };

    performLogout();

    return () => {};
  }, [logout, navigate]);

  const handleBackToLogin = () => {
    navigate("/login", { replace: true });
  };

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {status === "success" && "Logout berhasil"}
            {status === "error" && "Logout gagal"}
            {status === "loading" && "Memproses logout"}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {status === "success" &&
              "Anda telah keluar dari sistem. Anda akan dialihkan ke halaman login dalam beberapa detik."}
            {status === "error" &&
              "Terjadi kesalahan saat logout, tetapi data lokal telah dihapus. Anda akan dialihkan ke halaman login."}
            {status === "loading" &&
              "Mohon tunggu sebentar, sedang memproses logout..."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleBackToLogin}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Memproses..." : "Kembali ke Login"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}