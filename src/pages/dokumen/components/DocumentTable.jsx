import { useEffect, useState } from "react";
import EditDocumentModal from "./EditDocumentModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");



  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://backend-database-two.vercel.app/api/v1/documents/show-all");

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

  function LoadingScreen() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-xl font-semibold tracking-wide">
            Document Manager
          </h1>
  
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"/>
  
          <p className="text-sm text-muted-foreground">
            Memuat data dokumen...
          </p>
        </div>
      </div>
    );
  }
  
  

  if (loading) {
    return <LoadingScreen />;
  }  

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `https://backend-database-two.vercel.app/api/v1/documents/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include", // ⬅️ WAJIB kalau pakai cookie
        }
      );
  
      if (!res.ok) {
        const text = await res.text();
        console.error("API RESPONSE:", text);
        throw new Error("Gagal menghapus data");
      }
  
      fetchDocuments();
    } catch (error) {
      console.error("Delete error:", error);
      setErrorMessage("Dokumen tidak dapat dihapus.");
      setErrorOpen(true);
    }
  };
  
  
  return (
    <div className="mt-10 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nomor</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>File</TableHead>
            <TableHead className="text-center">Action</TableHead>
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
            <Button asChild size="sm" variant="outline">
              <a
                href={doc.document_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Detail
              </a>
            </Button>
          </TableCell>


          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              {/* EDIT */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {  
                  setSelectedDoc(doc);
                  setOpenEdit(true);
                }}
              >
                Edit
              </Button>

              {/* DELETE */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteId(doc.id)}
                  >
                    Hapus
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Hapus dokumen ini?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini tidak dapat dibatalkan.
                      Dokumen akan dihapus permanen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(deleteId)}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Ya, Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </TableCell>
          </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {openEdit && selectedDoc && (
      <EditDocumentModal
        open={openEdit}
        onOpenChange={setOpenEdit}
        document={selectedDoc}
        onSuccess={fetchDocuments}
      />
    )}
    <AlertDialog open={errorOpen} onOpenChange={setErrorOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Gagal Menghapus Dokumen</AlertDialogTitle>
          <AlertDialogDescription>
            {errorMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
  );
}
