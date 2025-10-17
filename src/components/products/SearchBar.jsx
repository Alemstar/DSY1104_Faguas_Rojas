import { useState, useMemo } from "react"

const SearchBar = ({ productos, onFilteredProductsChange }) => {
  const [searchValue, setSearchValue] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")

  // Filtrar y ordenar productos
  const productosFiltrados = useMemo(() => {
    let filtered = [...productos]

    // Filtrar por búsqueda
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase()
      filtered = filtered.filter(p => 
        p.nombre?.toLowerCase().includes(searchLower) ||
        p.code?.toLowerCase().includes(searchLower) ||
        p.descripcion?.toLowerCase().includes(searchLower)
      )
    }

    // Ordenar por precio
    filtered.sort((a, b) => {
      const precioA = a.precioCLP ?? 0
      const precioB = b.precioCLP ?? 0
      return sortOrder === "asc" ? precioA - precioB : precioB - precioA
    })

    return filtered
  }, [productos, searchValue, sortOrder])

  // Notificar cambios al padre
  useMemo(() => {
    onFilteredProductsChange(productosFiltrados)
  }, [productosFiltrados, onFilteredProductsChange])

  return (
    <div className="search-bar" style={{ display: "flex", gap: "1rem", alignItems: "center", }}>
      <input
        type="text"
        placeholder="Buscar por nombre o código"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        style={{ padding: "0.5rem", fontSize: "1rem" }}
      />
      <select
        value={sortOrder}
        onChange={e => setSortOrder(e.target.value)}
        style={{ padding: "0.5rem", fontSize: "1rem" }}
      >
        <option value="asc">Precio: Menor a mayor</option>
        <option value="desc">Precio: Mayor a menor</option>
      </select>
    </div>
  );
};

export default SearchBar;
