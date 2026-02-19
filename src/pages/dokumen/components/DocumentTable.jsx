import { useEffect, useState } from "react";
import "@lottiefiles/lottie-player";
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
import loadingPaperplane from "@/assets/icon/Loading 40 _ Paperplane.json";
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
  
          <lottie-player
            src={loadingPaperplane}
            background="transparent"
            speed="1"
            style={{ width: "150px", height: "150px" }}
            autoplay
            loop
          />
  
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
        <div className="rounded-lg border overflow-hidden overflow-x-auto">
          <Table className="min-w-[300px]">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Nomor</TableHead>
                <TableHead className="whitespace-nowrap hidden xs:table-cell">Tipe</TableHead>
                <TableHead className="whitespace-nowrap hidden md:table-cell">Project</TableHead>
                <TableHead className="whitespace-nowrap hidden lg:table-cell">Client</TableHead>
                <TableHead className="whitespace-nowrap hidden sm:table-cell">File</TableHead>
                <TableHead className="text-center whitespace-nowrap">Action</TableHead>
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
                    <TableCell className="whitespace-nowrap">{doc.number}</TableCell>
                    <TableCell className="whitespace-nowrap hidden xs:table-cell">{doc.document_types ?? "-"}</TableCell>
                    <TableCell className="whitespace-nowrap hidden md:table-cell">
                      {projects.find(p => String(p.id) === String(doc.project_id))?.project_name ?? "-"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap hidden lg:table-cell">
                      {clients.find(c => String(c.id) === String(doc.client_id))?.name ?? "-"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap hidden sm:table-cell">
                      <Button asChild size="icon" variant="outline" className="h-8 w-8 p-0">
                        <a
                          href={doc.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View File"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </a>
                      </Button>
                    </TableCell>
    
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1 flex-nowrap">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedDoc(doc);
                            setOpenEdit(true);
                          }}
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        </Button>
    
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="h-8 w-8 p-0"
                              onClick={() => setDeleteId(doc.id)}
                              title="Delete"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
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