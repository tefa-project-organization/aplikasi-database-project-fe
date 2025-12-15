const SearchBar = ({ searchTerm, onSearchChange }) => {
    return (
      <input
        type="text"
        placeholder="Search Bar"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-full"
      />
    );
  };
  export default SearchBar;