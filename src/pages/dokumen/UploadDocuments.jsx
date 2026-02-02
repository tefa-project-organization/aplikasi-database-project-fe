import { useState } from "react";
import UploadDocumentModal from "./components/UploadDocumentModal";
import DocumentTable from "./components/DocumentTable";

export default function UploadDocuments() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dokumen</h1>

        <UploadDocumentModal
          onSuccess={() => setRefresh((r) => r + 1)}
        />
      </div>

      {/* TABLE */}
      <DocumentTable refresh={refresh} />
    </div>
  );
}
