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
import AdvancedPagination from "@/components/ui/AdvancedPagination";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://backend-database-two.vercel.app/api/v1/documents/show-all?limit=100000");

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
    const fetchProjectsAndClients = async () => {
      try {
        const [projectRes, clientRes] = await Promise.all([
          fetch("https://backend-database-two.vercel.app/api/v1/projects/show-all"),
          fetch("https://backend-database-two.vercel.app/api/v1/clients/show-all"),
        ]);
  
        const projectData = await projectRes.json();
        const clientData = await clientRes.json();
  
        setProjects(projectData.data?.items || []);
        setClients(clientData.data?.items || []);
      } catch (error) {
        console.error("Error fetching project/client:", error);
        setProjects([]);
        setClients([]);
      }
    };
  
    fetchProjectsAndClients();
  }, []);
  
const [projects, setProjects] = useState([]);
const [clients, setClients] = useState([]);


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
          credentials: "include", 
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

 
    const totalPages = Math.ceil(documents.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentDocuments = documents.slice(startIndex, endIndex);

    return (
      <div className="mt-10">
    
        {/* TABLE WRAPPER */}
        <div className="rounded-lg border overflow-hidden">
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
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    Tidak ada data
                  </TableCell>
                </TableRow>
              ) : (
                currentDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.number}</TableCell>
                    <TableCell>{doc.document_types ?? "-"}</TableCell>
                    <TableCell>
                      {projects.find(p => String(p.id) === String(doc.project_id))?.project_name ?? "-"}
                    </TableCell>
                    <TableCell>
                      {clients.find(c => String(c.id) === String(doc.client_id))?.name ?? "-"}
                    </TableCell>
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
        </div>
    
        {/* PAGINATION */}
        <AdvancedPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="px-4 py-4 border-t"
        />
    
        {/* EDIT MODAL */}
        {openEdit && selectedDoc && (
          <EditDocumentModal
            open={openEdit}
            onOpenChange={setOpenEdit}
            initialData={selectedDoc}
            onSuccess={fetchDocuments}
          />
        )}
    
        {/* ERROR MODAL */}
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