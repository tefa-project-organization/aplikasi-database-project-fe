export default function UploadDocuments() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">
          Upload Dokumen
        </h1>
  
        <div className="border rounded-lg p-6 bg-background">
          <input
            type="file"
            className="block w-full text-sm"
          />
        </div>
      </div>
    );
  }
  