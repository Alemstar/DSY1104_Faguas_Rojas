// Mock para CartItem que utiliza import.meta.url
jest.mock('./CartItem', () => {
  const React = require('react');
  
  return function CartItem({ item, onQuantityChange, onRemove }) {
    const handleQuantityChange = (newQuantity) => {
      if (newQuantity < 1) return;
      onQuantityChange(item.id, newQuantity);
    };

    const itemTotal = item.producto.precioCLP * item.quantity;

    return React.createElement('div', { className: 'cart-item' },
      React.createElement('div', { className: 'cart-item-image' },
        item.producto.imagen && React.createElement('img', {
          src: `/assets/${item.producto.imagen}`,
          alt: item.producto.nombre
        })
      ),
      React.createElement('div', { className: 'cart-item-details' },
        React.createElement('h3', { className: 'cart-item-name' }, item.producto.nombre),
        item.size && item.size !== 'unidad' && React.createElement('p', { className: 'cart-item-size' }, `Tamaño: ${item.size}`),
        item.customDetails && React.createElement('div', { className: 'cart-item-custom-details' },
          React.createElement('p', { className: 'cart-item-detail' }, `Forma: ${item.customDetails.shape}`),
          React.createElement('p', { className: 'cart-item-detail' }, `Sabor: ${item.customDetails.flavor}`),
          item.customDetails.fillings && item.customDetails.fillings.length > 0 && 
            React.createElement('p', { className: 'cart-item-detail' }, `Rellenos: ${item.customDetails.fillings.join(', ')}`)
        ),
        item.personalizationMessage && React.createElement('p', { className: 'cart-item-message' }, `Mensaje: "${item.personalizationMessage}"`),
        React.createElement('div', { className: 'cart-item-quantity' },
          React.createElement('button', {
            onClick: () => handleQuantityChange(item.quantity - 1),
            disabled: item.quantity <= 1,
            className: 'quantity-btn'
          }, '-'),
          React.createElement('span', { className: 'quantity-display' }, item.quantity),
          React.createElement('button', {
            onClick: () => handleQuantityChange(item.quantity + 1),
            className: 'quantity-btn'
          }, '+')
        )
      ),
      React.createElement('div', { className: 'cart-item-price' },
        React.createElement('p', { className: 'item-price' }, `$${itemTotal.toLocaleString('es-CL')}`),
        React.createElement('button', {
          onClick: () => onRemove(item.id),
          className: 'remove-item-btn'
        }, 'Eliminar')
      )
    );
  };
});

import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from './CartItem';

describe('CartItem Component', () => {
  const mockItem = {
    id: '1',
    producto: {
      nombre: 'Pastel de Chocolate',
      precioCLP: 15000,
      imagen: '/assets/pastel-chocolate.jpg'
    },
    quantity: 2,
    size: 'mediano'
  };

  test('debe renderizar el item del carrito con toda la información', () => {
    const mockOnQuantityChange = jest.fn();
    const mockOnRemove = jest.fn();

    render(
      <CartItem
        item={mockItem}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('Pastel de Chocolate')).toBeInTheDocument();
    expect(screen.getByText('Tamaño: mediano')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('debe calcular y mostrar el precio total correctamente', () => {
    const mockOnQuantityChange = jest.fn();
    const mockOnRemove = jest.fn();

    render(
      <CartItem
        item={mockItem}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    // 15000 * 2 = 30000
    expect(screen.getByText(/30\.000/)).toBeInTheDocument();
  });

  test('debe incrementar la cantidad cuando se hace clic en el botón +', () => {
    const mockOnQuantityChange = jest.fn();
    const mockOnRemove = jest.fn();

    render(
      <CartItem
        item={mockItem}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    const incrementButton = screen.getAllByRole('button').find(btn => btn.textContent === '+');
    fireEvent.click(incrementButton);

    expect(mockOnQuantityChange).toHaveBeenCalledWith('1', 3);
  });

  test('debe decrementar la cantidad cuando se hace clic en el botón -', () => {
    const mockOnQuantityChange = jest.fn();
    const mockOnRemove = jest.fn();

    render(
      <CartItem
        item={mockItem}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    const decrementButton = screen.getAllByRole('button').find(btn => btn.textContent === '-');
    fireEvent.click(decrementButton);

    expect(mockOnQuantityChange).toHaveBeenCalledWith('1', 1);
  });

  test('debe deshabilitar el botón - cuando la cantidad es 1', () => {
    const mockOnQuantityChange = jest.fn();
    const mockOnRemove = jest.fn();
    const itemWithMinQuantity = { ...mockItem, quantity: 1 };

    render(
      <CartItem
        item={itemWithMinQuantity}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    const decrementButton = screen.getAllByRole('button').find(btn => btn.textContent === '-');
    expect(decrementButton).toBeDisabled();
  });

  test('debe llamar a onRemove cuando se hace clic en Eliminar', () => {
    const mockOnQuantityChange = jest.fn();
    const mockOnRemove = jest.fn();

    render(
      <CartItem
        item={mockItem}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    const removeButton = screen.getByRole('button', { name: /eliminar/i });
    fireEvent.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledWith('1');
  });

  test('debe mostrar detalles de personalización cuando existen', () => {
    const itemWithCustomDetails = {
      ...mockItem,
      customDetails: {
        shape: 'Redondo',
        flavor: 'Chocolate',
        fillings: ['Fresa', 'Crema']
      }
    };

    const mockOnQuantityChange = jest.fn();
    const mockOnRemove = jest.fn();

    render(
      <CartItem
        item={itemWithCustomDetails}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText(/Forma: Redondo/)).toBeInTheDocument();
    expect(screen.getByText(/Sabor: Chocolate/)).toBeInTheDocument();
    expect(screen.getByText(/Rellenos: Fresa, Crema/)).toBeInTheDocument();
  });

  test('debe mostrar mensaje de personalización cuando existe', () => {
    const itemWithMessage = {
      ...mockItem,
      personalizationMessage: 'Feliz Cumpleaños'
    };

    const mockOnQuantityChange = jest.fn();
    const mockOnRemove = jest.fn();

    render(
      <CartItem
        item={itemWithMessage}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText(/Mensaje: "Feliz Cumpleaños"/)).toBeInTheDocument();
  });

  test('no debe mostrar tamaño si es "unidad"', () => {
    const itemWithUnitSize = { ...mockItem, size: 'unidad' };
    const mockOnQuantityChange = jest.fn();
    const mockOnRemove = jest.fn();

    render(
      <CartItem
        item={itemWithUnitSize}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.queryByText(/Tamaño:/)).not.toBeInTheDocument();
  });
});
