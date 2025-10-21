import { render, screen, fireEvent } from '@testing-library/react';
import QuantitySelector from './QuantitySelector';

describe('QuantitySelector Component', () => {
  test('debe renderizar el selector de cantidad con el valor inicial', () => {
    const mockOnQuantityChange = jest.fn();

    render(
      <QuantitySelector
        quantity={5}
        onQuantityChange={mockOnQuantityChange}
      />
    );

    expect(screen.getByLabelText(/cantidad/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });

  test('debe incrementar la cantidad cuando se hace clic en el botón +', () => {
    const mockOnQuantityChange = jest.fn();

    render(
      <QuantitySelector
        quantity={5}
        onQuantityChange={mockOnQuantityChange}
      />
    );

    const incrementButton = screen.getAllByRole('button').find(btn => btn.textContent === '+');
    fireEvent.click(incrementButton);

    expect(mockOnQuantityChange).toHaveBeenCalledWith(6);
  });

  test('debe decrementar la cantidad cuando se hace clic en el botón -', () => {
    const mockOnQuantityChange = jest.fn();

    render(
      <QuantitySelector
        quantity={5}
        onQuantityChange={mockOnQuantityChange}
      />
    );

    const decrementButton = screen.getAllByRole('button').find(btn => btn.textContent === '-');
    fireEvent.click(decrementButton);

    expect(mockOnQuantityChange).toHaveBeenCalledWith(4);
  });

  test('debe deshabilitar el botón - cuando la cantidad es mínima', () => {
    const mockOnQuantityChange = jest.fn();

    render(
      <QuantitySelector
        quantity={1}
        onQuantityChange={mockOnQuantityChange}
        min={1}
      />
    );

    const decrementButton = screen.getAllByRole('button').find(btn => btn.textContent === '-');
    expect(decrementButton).toBeDisabled();
  });

  test('debe deshabilitar el botón + cuando la cantidad es máxima', () => {
    const mockOnQuantityChange = jest.fn();

    render(
      <QuantitySelector
        quantity={99}
        onQuantityChange={mockOnQuantityChange}
        max={99}
      />
    );

    const incrementButton = screen.getAllByRole('button').find(btn => btn.textContent === '+');
    expect(incrementButton).toBeDisabled();
  });

  test('debe actualizar la cantidad cuando se escribe en el input', () => {
    const mockOnQuantityChange = jest.fn();

    render(
      <QuantitySelector
        quantity={5}
        onQuantityChange={mockOnQuantityChange}
      />
    );

    const input = screen.getByDisplayValue('5');
    fireEvent.change(input, { target: { value: '10' } });

    expect(mockOnQuantityChange).toHaveBeenCalledWith(10);
  });

  test('debe usar el valor mínimo por defecto cuando el input está vacío', () => {
    const mockOnQuantityChange = jest.fn();

    render(
      <QuantitySelector
        quantity={5}
        onQuantityChange={mockOnQuantityChange}
        min={1}
      />
    );

    const input = screen.getByDisplayValue('5');
    fireEvent.change(input, { target: { value: '' } });

    expect(mockOnQuantityChange).toHaveBeenCalledWith(1);
  });

  test('debe respetar los límites personalizados min y max', () => {
    const mockOnQuantityChange = jest.fn();

    render(
      <QuantitySelector
        quantity={5}
        onQuantityChange={mockOnQuantityChange}
        min={3}
        max={10}
      />
    );

    const input = screen.getByDisplayValue('5');
    expect(input).toHaveAttribute('min', '3');
    expect(input).toHaveAttribute('max', '10');
  });

  test('no debe actualizar si el valor está fuera del rango permitido', () => {
    const mockOnQuantityChange = jest.fn();

    render(
      <QuantitySelector
        quantity={5}
        onQuantityChange={mockOnQuantityChange}
        min={1}
        max={10}
      />
    );

    const input = screen.getByDisplayValue('5');
    fireEvent.change(input, { target: { value: '15' } });

    // No debe llamar a onQuantityChange porque 15 está fuera del rango
    expect(mockOnQuantityChange).not.toHaveBeenCalled();
  });

  test('debe tener los valores por defecto correctos (min=1, max=99)', () => {
    const mockOnQuantityChange = jest.fn();

    render(
      <QuantitySelector
        quantity={5}
        onQuantityChange={mockOnQuantityChange}
      />
    );

    const input = screen.getByDisplayValue('5');
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('max', '99');
  });
});
