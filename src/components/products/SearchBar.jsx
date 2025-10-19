import { useState } from 'react';

const SearchBar = ({ productos, onFilteredProductsChange }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (value) => {
    setSearchValue(value);
    
    if (!value.trim()) {
      onFilteredProductsChange(productos);
      return;
    }

    const filtered = productos.filter(producto => {
      const searchLower = value.toLowerCase();
      return (
        producto.nombre?.toLowerCase().includes(searchLower) ||
        producto.code?.toLowerCase().includes(searchLower)
      );
    });
    
    onFilteredProductsChange(filtered);
  };

  return (
    <input
      type="text"
      id="search-products"
      name="search"
      aria-label="Buscar productos por nombre o código"
      placeholder="Buscar por nombre o código"
      value={searchValue}
      onChange={e => handleSearchChange(e.target.value)}
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
