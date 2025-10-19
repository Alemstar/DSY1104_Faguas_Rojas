const SearchBar = ({ searchValue, onSearchChange }) => {
  return (
    <input
      type="text"
      placeholder="Buscar por nombre o código"
      value={searchValue}
      onChange={e => onSearchChange(e.target.value)}
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
