import { useState, useMemo } from "react"

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
  useMemo(() => {
    onFilteredProductsChange(productosOrdenados)
  }, [productosOrdenados, onFilteredProductsChange])

  return (
    <select
      value={sortOrder}
      onChange={e => setSortOrder(e.target.value)}
      style={{ padding: "0.5rem", fontSize: "1rem" }}
    >
      <option value="asc">Precio: Menor a mayor</option>
      <option value="desc">Precio: Mayor a menor</option>
    </select>
  );
};

export default PriceFilter;
