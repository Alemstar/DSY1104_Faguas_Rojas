const PriceFilter = ({ sortOrder, setSortOrder }) => {
  return (
    <select
      id="price-filter"
      name="priceOrder"
      aria-label="Ordenar productos por precio"
      value={sortOrder}
      onChange={e => setSortOrder(e.target.value)}
      className="price-filter-select"
      style={{ 
        padding: "0.35rem 0.5rem", 
        fontSize: "0.9rem",
        borderRadius: "6px",
        border: "1px solid rgba(0,0,0,0.08)",
        background: "#fff",
        maxWidth: "180px"
      }}
    >
      <option value="asc">Precio: Menor a mayor</option>
      <option value="desc">Precio: Mayor a menor</option>
    </select>
  );
};

export default PriceFilter;
