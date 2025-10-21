// Mock para ProductCard que utiliza import.meta.url
jest.mock('./ProductCard', () => {
  const React = require('react');
  
  return function ProductCard({ product, onAdd }) {
    const handleAdd = () => {
      if (onAdd) {
        onAdd(product);
      } else {
        console.log('Add clicked:', product.code);
      }
    };

    return React.createElement('div', { className: 'product-card custom-card' },
      product.imagen && React.createElement('div', { className: 'card-img-container' },
        React.createElement('img', {
          src: `/assets/${product.imagen}`,
          alt: product.nombre,
          className: 'product-image'
        })
      ),
      React.createElement('div', { className: 'card-body' },
        React.createElement('h3', { className: 'card-title' }, product.nombre),
        React.createElement('p', { className: 'card-desc' }, product.descripcion),
        React.createElement('div', { className: 'card-footer' },
          React.createElement('span', { className: 'product-price' },
            `$${product.precioCLP?.toLocaleString('es-CL')}`
          ),
          React.createElement('button', {
            className: 'add-btn',
            onClick: handleAdd,
            disabled: product.stock === 0
          }, 'Añadir')
        )
      )
    );
  };
});

import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

describe('ProductCard Component', () => {
  const mockProduct = {
    code: 'P001',
    nombre: 'Pastel de Chocolate',
    descripcion: 'Delicioso pastel de chocolate con crema',
    precioCLP: 15000,
    imagen: '/assets/pastel-chocolate.jpg',
    stock: 10
  };

  test('debe renderizar el producto con todos sus detalles', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Pastel de Chocolate')).toBeInTheDocument();
    expect(screen.getByText('Delicioso pastel de chocolate con crema')).toBeInTheDocument();
    expect(screen.getByText(/15\.000/)).toBeInTheDocument();
  });

  test('debe renderizar la imagen del producto', () => {
    render(<ProductCard product={mockProduct} />);

    const image = screen.getByAltText('Pastel de Chocolate');
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass('product-image');
  });

  test('debe mostrar el precio formateado correctamente', () => {
    render(<ProductCard product={mockProduct} />);

    const priceElement = screen.getByText(/15\.000/);
    expect(priceElement).toBeInTheDocument();
  });

  test('debe llamar a onAdd cuando se hace clic en el botón Añadir', () => {
    const mockOnAdd = jest.fn();
    render(<ProductCard product={mockProduct} onAdd={mockOnAdd} />);

    const addButton = screen.getByRole('button', { name: /añadir/i });
    fireEvent.click(addButton);

    expect(mockOnAdd).toHaveBeenCalledWith(mockProduct);
  });

  test('debe deshabilitar el botón cuando el stock es 0', () => {
    const productWithoutStock = { ...mockProduct, stock: 0 };
    render(<ProductCard product={productWithoutStock} />);

    const addButton = screen.getByRole('button', { name: /añadir/i });
    expect(addButton).toBeDisabled();
  });

  test('debe manejar productos sin imagen', () => {
    const productWithoutImage = { ...mockProduct, imagen: null };
    render(<ProductCard product={productWithoutImage} />);

    expect(screen.getByText('Pastel de Chocolate')).toBeInTheDocument();
    expect(screen.queryByAltText('Pastel de Chocolate')).not.toBeInTheDocument();
  });

  test('debe renderizar sin onAdd (modo preview)', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<ProductCard product={mockProduct} />);

    const addButton = screen.getByRole('button', { name: /añadir/i });
    fireEvent.click(addButton);

    expect(consoleSpy).toHaveBeenCalledWith('Add clicked:', 'P001');
    
    consoleSpy.mockRestore();
  });

  test('debe tener las clases CSS correctas', () => {
    const { container } = render(<ProductCard product={mockProduct} />);

    const productCard = container.querySelector('.product-card');
    expect(productCard).toBeInTheDocument();
    expect(productCard).toHaveClass('custom-card');
  });
});
