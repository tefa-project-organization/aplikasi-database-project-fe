import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ✅ DUMMY DATA (tidak mengganggu API asli) */
const dummyDocuments = [
  {
    id: 1,
    number: "DOC-001",
    document_types: "Kontrak",
    project_id: "Website Company Profile",
    client_id: "PT Maju Jaya",
    document_url: "#",
  },
  {
    id: 2,
    number: "DOC-002",
    document_types: "Invoice",
    project_id: "Aplikasi Laundry",
    client_id: "CV Bersih Selalu",
    document_url: "#",
  },
  {
    id: 3,
    number: "DOC-003",
    document_types: "Laporan",
    project_id: "Sistem Absensi",
    client_id: "SMKN 4 Bandung",
    document_url: "#",
  },
];

export default function DocumentTable({ refresh }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/documents/show-all");

      if (!res.ok) {
        throw new Error("Gagal fetch data");
      }

      const json = await res.json();

      /* ✅ Kalau API kosong → pakai dummy */
      setDocuments(
        json.data?.items && json.data.items.length > 0
          ? json.data.items
          : dummyDocuments
      );
    } catch (error) {
      console.error("Fetch error:", error);
      setDocuments(dummyDocuments); // ✅ fallback dummy
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refresh]);

  if (loading) {
    return (
      <div className="mt-6 flex justify-center rounded-lg border p-6">
        <p className="text-sm text-muted-foreground">
          Memuat data dokumen...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nomor</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>File</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {documents.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                Tidak ada data
              </TableCell>
            </TableRow>
          ) : (
            documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.number}</TableCell>
                <TableCell>{doc.document_types ?? "-"}</TableCell>
                <TableCell>{doc.project_id}</TableCell>
                <TableCell>{doc.client_id}</TableCell>
                <TableCell>
                  <a
                    href={doc.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-4"
                  >
                    Lihat
                  </a>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
