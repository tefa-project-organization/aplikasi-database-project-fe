// Komponen ini sudah tidak diperlukan karena PIC diassign melalui form PIC
// Hanya untuk backward compatibility
export default function ClientPicTable() {
  return (
    <div className="text-center py-4 text-muted-foreground">
      PIC assignment is done through PIC form (with client_id field)
    </div>
  )
}