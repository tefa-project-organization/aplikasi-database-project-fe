// src/pages/Projects/widget/SearchBar.jsx
import { Input } from "@/components/ui/input"

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <Input
      placeholder="Cari proyek..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full"
    />
  )
}

export default SearchBar
