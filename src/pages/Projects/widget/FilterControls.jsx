const FilterControls = ({ filterStatus, filterPm, onStatusChange, onPmChange }) => {
    const statusOptions = ['All', 'Finished', 'In Progress', 'Overdue'];
    // Dapatkan daftar PM unik dari data nyata
    const pmOptions = ['All PM', 'Don Be', 'Narti', 'PM A', 'PM B']; 
  
    return (
      <div className="flex gap-3">
        {/* Filter by Status (Biru) */}
        <select 
          value={filterStatus} 
          onChange={(e) => onStatusChange(e.target.value)}
          className="border border-blue-400 text-blue-800 rounded-md p-2" // Contoh styling biru
        >
          {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
        </select>
        
        {/* Filter by PM (Merah) */}
        <select 
          value={filterPm} 
          onChange={(e) => onPmChange(e.target.value)}
          className="border border-red-400 text-red-800 rounded-md p-2" // Contoh styling merah
        >
          {pmOptions.map(pm => <option key={pm} value={pm}>{pm}</option>)}
        </select>
      </div>
    );
  };
  export default FilterControls;