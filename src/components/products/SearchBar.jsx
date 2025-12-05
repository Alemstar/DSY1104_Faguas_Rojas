const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <input
      type="text"
      id="search-products"
      name="search"
      aria-label="Buscar productos por nombre o ID"
      placeholder="Buscar por nombre o ID"
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      style={{ 
        padding: "0.35rem 0.5rem", 
        fontSize: "0.9rem",
        borderRadius: "6px",
        border: "1px solid rgba(0,0,0,0.08)",
        background: "#fff",
        minWidth: "200px",
        maxWidth: "250px"
      }}
    />
  );
};

export default SearchBar;
