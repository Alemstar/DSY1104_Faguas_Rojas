const SearchBar = ({ searchValue, onSearchChange }) => {
  return (
    <input
      type="text"
      placeholder="Buscar por nombre o código"
      value={searchValue}
      onChange={e => onSearchChange(e.target.value)}
      style={{ padding: "0.5rem", fontSize: "1rem" }}
    />
  );
};

export default SearchBar;
