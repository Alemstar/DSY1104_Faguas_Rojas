import { useState, useMemo, useEffect } from "react"

const PriceFilter = ({ productos, onFilteredProductsChange }) => {
  const [sortOrder, setSortOrder] = useState("asc")

  // Ordenar productos por precio
  const productosOrdenados = useMemo(() => {
    let sorted = [...productos]

    sorted.sort((a, b) => {
      const precioA = a.precioCLP ?? 0
      const precioB = b.precioCLP ?? 0
      return sortOrder === "asc" ? precioA - precioB : precioB - precioA
    })

    return sorted
  }, [productos, sortOrder])

  // Notificar cambios al padre
  useEffect(() => {
    onFilteredProductsChange(productosOrdenados)
  }, [productosOrdenados, onFilteredProductsChange])

  return (
    <select
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
