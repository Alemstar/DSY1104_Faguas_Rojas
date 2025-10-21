import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  const mockProductos = [
    { code: 'P001', nombre: 'Pastel de Chocolate' },
    { code: 'P002', nombre: 'Torta de Vainilla' },
    { code: 'P003', nombre: 'Cupcake de Fresa' },
    { code: 'P004', nombre: 'Brownie de Chocolate' }
  ];

  test('debe renderizar el input de búsqueda', () => {
    const mockOnFilteredProductsChange = jest.fn();

    render(
      <SearchBar
        productos={mockProductos}
        onFilteredProductsChange={mockOnFilteredProductsChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/buscar por nombre o código/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('debe filtrar productos por nombre', () => {
    const mockOnFilteredProductsChange = jest.fn();

    render(
      <SearchBar
        productos={mockProductos}
        onFilteredProductsChange={mockOnFilteredProductsChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/buscar por nombre o código/i);
    fireEvent.change(searchInput, { target: { value: 'chocolate' } });

    expect(mockOnFilteredProductsChange).toHaveBeenCalledWith([
      { code: 'P001', nombre: 'Pastel de Chocolate' },
      { code: 'P004', nombre: 'Brownie de Chocolate' }
    ]);
  });

  test('debe filtrar productos por código', () => {
    const mockOnFilteredProductsChange = jest.fn();

    render(
      <SearchBar
        productos={mockProductos}
        onFilteredProductsChange={mockOnFilteredProductsChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/buscar por nombre o código/i);
    fireEvent.change(searchInput, { target: { value: 'P002' } });

    expect(mockOnFilteredProductsChange).toHaveBeenCalledWith([
      { code: 'P002', nombre: 'Torta de Vainilla' }
    ]);
  });

  test('debe ser case-insensitive al buscar', () => {
    const mockOnFilteredProductsChange = jest.fn();

    render(
      <SearchBar
        productos={mockProductos}
        onFilteredProductsChange={mockOnFilteredProductsChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/buscar por nombre o código/i);
    fireEvent.change(searchInput, { target: { value: 'VAINILLA' } });

    expect(mockOnFilteredProductsChange).toHaveBeenCalledWith([
      { code: 'P002', nombre: 'Torta de Vainilla' }
    ]);
  });

  test('debe retornar todos los productos cuando el input está vacío', () => {
    const mockOnFilteredProductsChange = jest.fn();

    render(
      <SearchBar
        productos={mockProductos}
        onFilteredProductsChange={mockOnFilteredProductsChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/buscar por nombre o código/i);
    
    // Primero escribimos algo
    fireEvent.change(searchInput, { target: { value: 'chocolate' } });
    
    // Luego borramos
    fireEvent.change(searchInput, { target: { value: '' } });

    expect(mockOnFilteredProductsChange).toHaveBeenLastCalledWith(mockProductos);
  });

  test('debe retornar array vacío cuando no hay coincidencias', () => {
    const mockOnFilteredProductsChange = jest.fn();

    render(
      <SearchBar
        productos={mockProductos}
        onFilteredProductsChange={mockOnFilteredProductsChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/buscar por nombre o código/i);
    fireEvent.change(searchInput, { target: { value: 'producto inexistente' } });

    expect(mockOnFilteredProductsChange).toHaveBeenCalledWith([]);
  });

  test('debe actualizar el valor del input cuando el usuario escribe', () => {
    const mockOnFilteredProductsChange = jest.fn();

    render(
      <SearchBar
        productos={mockProductos}
        onFilteredProductsChange={mockOnFilteredProductsChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/buscar por nombre o código/i);
    fireEvent.change(searchInput, { target: { value: 'pastel' } });

    expect(searchInput.value).toBe('pastel');
  });

  test('debe manejar productos sin nombre o código', () => {
    const productosIncompletos = [
      { code: 'P001', nombre: 'Pastel' },
      { code: null, nombre: 'Torta' },
      { code: 'P003', nombre: null }
    ];

    const mockOnFilteredProductsChange = jest.fn();

    render(
      <SearchBar
        productos={productosIncompletos}
        onFilteredProductsChange={mockOnFilteredProductsChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/buscar por nombre o código/i);
    fireEvent.change(searchInput, { target: { value: 'pastel' } });

    // Debe filtrar sin errores
    expect(mockOnFilteredProductsChange).toHaveBeenCalled();
  });

  test('debe ignorar espacios en blanco al inicio y final', () => {
    const mockOnFilteredProductsChange = jest.fn();

    render(
      <SearchBar
        productos={mockProductos}
        onFilteredProductsChange={mockOnFilteredProductsChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/buscar por nombre o código/i);
    fireEvent.change(searchInput, { target: { value: '   ' } });

    // Debe retornar todos los productos cuando solo hay espacios
    expect(mockOnFilteredProductsChange).toHaveBeenCalledWith(mockProductos);
  });
});
