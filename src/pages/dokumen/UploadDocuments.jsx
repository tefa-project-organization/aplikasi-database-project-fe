import { useState, useEffect } from "react";
import UploadDocumentModal from "./components/UploadDocumentModal";
import DocumentTable from "./components/DocumentTable";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

export default function UploadDocuments() {
  const [refresh, setRefresh] = useState(0);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setStatus("");
      }, 5000); // 5 detik
  
      return () => clearTimeout(timer);
    }
  }, [message]);
  

  return (
    <div className="p-6 space-y-6">
      {/* HEADER + ACTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Upload Dokumen
        </h2>

        <UploadDocumentModal
          onSuccess={(msg) => {
            setStatus("success");
            setMessage(msg);
            setRefresh((r) => r + 1);
          }}
          onError={(msg) => {
            setStatus("error");
            setMessage(msg);
          }}
        />
      </div>

      {/* STATUS CARD DI LUAR MODAL */}
      {message && (
        <Card
          className={`border max-w-xl transition-all duration-300 ${
            status === "success"
              ? "border-green-500 bg-green-50"
              : "border-red-500 bg-red-50"
          }`}
        >

          <CardContent className="flex items-center gap-3 p-4">
            {status === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <p
              className={`text-sm font-medium ${
                status === "success"
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {message}
            </p>
          </CardContent>
        </Card>
      )}

      {/* TABLE */}
      <DocumentTable refresh={refresh} />
    </div>
  );
}
