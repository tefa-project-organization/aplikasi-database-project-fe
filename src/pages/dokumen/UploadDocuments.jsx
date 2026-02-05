import { useState } from "react";
import UploadDocumentModal from "./components/UploadDocumentModal";
import DocumentTable from "./components/DocumentTable";

export default function UploadDocuments() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="p-6 space-y-6">
      {/* HEADER + ACTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* HEADER */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Upload Dokumen
          </h2>
        </div>

        {/* BUTTON KE KANAN */}
        <UploadDocumentModal
          onSuccess={() => setRefresh((r) => r + 1)}
        />
      </div>

      {/* TABLE */}
      <DocumentTable refresh={refresh} />
    </div>
  );
}
