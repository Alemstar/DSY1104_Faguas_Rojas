
const SearchBar = ({ searchValue, onSearchChange, sortOrder, onSortOrderChange }) => {
  return (
    <div className="search-bar" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <input
        type="text"
        placeholder="Buscar por nombre o código"
        value={searchValue}
        onChange={e => onSearchChange(e.target.value)}
        style={{ padding: "0.5rem", fontSize: "1rem" }}
      />
      <select
        value={sortOrder}
        onChange={e => onSortOrderChange(e.target.value)}
        style={{ padding: "0.5rem", fontSize: "1rem" }}
      >
        <option value="asc">Precio: Menor a mayor</option>
        <option value="desc">Precio: Mayor a menor</option>
      </select>
    </div>
  );
};

export default SearchBar;
