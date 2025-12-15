// src/pages/Projects/Projects.jsx
import React, { useState, useMemo } from 'react';
// Asumsikan Anda telah membuat file di folder components:
import ProjectCard from './widget/ProjectCard';
import SearchBar from './widget/SearchBar';
import FilterControls from './widget/FilterControls';

// --- Data Contoh (Mock Data) ---
const MOCK_PROJECTS = [
  { id: 1, name: "Project 1", description: "lorem ipsum dolor sit amet.", status: "In Progress", pm: "Don Be" },
  { id: 2, name: "Project 2", description: "lorem ipsum dolor sit amet.", status: "Finished", pm: "Narti" },
  { id: 3, name: "Project 3", description: "lorem ipsum dolor sit amet.", status: "Overdue", pm: "Don Be" },
  { id: 4, name: "Project 4", description: "Deskripsi proyek penting.", status: "In Progress", pm: "Narti" },
];
// --------------------------------

export default function Projects() {
  // 1. State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPm, setFilterPm] = useState('All PM');
  
  const projects = MOCK_PROJECTS; // Nantinya ini bisa diganti dengan fetch API
  
  // 2. Logika Pemfilteran dan Pencarian
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Pencarian (case-insensitive)
      const matchesSearch = 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        project.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter Status
      const matchesStatus = filterStatus === 'All' || project.status === filterStatus;

      // Filter PM
      const matchesPm = filterPm === 'All PM' || project.pm === filterPm;

      return matchesSearch && matchesStatus && matchesPm;
    });
  }, [projects, searchTerm, filterStatus, filterPm]);

  return (
    <div>
      <h2 className="text-xl font-bold ">Projects</h2>
      <p className='text-m mb-5'>Manage and monitor your projects here.</p>

      {/* Area Kontrol (Sesuai Wireframe) */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <span className="label text-lg">Daftar Proyek</span>

        {/* Search Bar */}
        <div className="flex-grow">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>
        
        {/* Filter Controls */}
        <FilterControls
          filterStatus={filterStatus}
          filterPm={filterPm}
          onStatusChange={setFilterStatus}
          onPmChange={setFilterPm}
        />
      </div>

      {/* Area Daftar Proyek */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
        
        {filteredProjects.length === 0 && (
          <p className="text-gray-500 col-span-full">
            Tidak ada proyek yang cocok dengan kriteria pencarian/filter.
          </p>
        )}
      </div>
    </div>
  );
}