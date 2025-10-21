import { render, screen, fireEvent } from '@testing-library/react';
import CouponInput from './CouponInput';

describe('CouponInput Component', () => {
  test('debe renderizar el input del cupón', () => {
    const mockOnApplyCoupon = jest.fn();

    render(<CouponInput onApplyCoupon={mockOnApplyCoupon} />);

    expect(screen.getByLabelText(/cupón/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ingresa cupón/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /aplicar/i })).toBeInTheDocument();
  });

  test('debe actualizar el valor del input cuando el usuario escribe', () => {
    const mockOnApplyCoupon = jest.fn();

    render(<CouponInput onApplyCoupon={mockOnApplyCoupon} />);

    const input = screen.getByPlaceholderText(/ingresa cupón/i);
    fireEvent.change(input, { target: { value: 'FELICESS0' } });

    expect(input.value).toBe('FELICESS0');
  });

  test('debe llamar a onApplyCoupon con el código en mayúsculas cuando se hace clic en APLICAR', () => {
    const mockOnApplyCoupon = jest.fn();

    render(<CouponInput onApplyCoupon={mockOnApplyCoupon} />);

    const input = screen.getByPlaceholderText(/ingresa cupón/i);
    const button = screen.getByRole('button', { name: /aplicar/i });

    fireEvent.change(input, { target: { value: 'felicess0' } });
    fireEvent.click(button);

    expect(mockOnApplyCoupon).toHaveBeenCalledWith('FELICESS0');
  });

  test('debe llamar a onApplyCoupon cuando se presiona Enter', () => {
    const mockOnApplyCoupon = jest.fn();

    render(<CouponInput onApplyCoupon={mockOnApplyCoupon} />);

    const input = screen.getByPlaceholderText(/ingresa cupón/i);

    fireEvent.change(input, { target: { value: 'DESCUENTO10' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(mockOnApplyCoupon).toHaveBeenCalledWith('DESCUENTO10');
  });

  test('debe eliminar espacios en blanco del código antes de aplicar', () => {
    const mockOnApplyCoupon = jest.fn();

    render(<CouponInput onApplyCoupon={mockOnApplyCoupon} />);

    const input = screen.getByPlaceholderText(/ingresa cupón/i);
    const button = screen.getByRole('button', { name: /aplicar/i });

    fireEvent.change(input, { target: { value: '  CODIGO123  ' } });
    fireEvent.click(button);

    expect(mockOnApplyCoupon).toHaveBeenCalledWith('CODIGO123');
  });

  test('no debe llamar a onApplyCoupon si el input está vacío', () => {
    const mockOnApplyCoupon = jest.fn();

    render(<CouponInput onApplyCoupon={mockOnApplyCoupon} />);

    const button = screen.getByRole('button', { name: /aplicar/i });
    fireEvent.click(button);

    expect(mockOnApplyCoupon).not.toHaveBeenCalled();
  });

  test('no debe llamar a onApplyCoupon si el input solo tiene espacios', () => {
    const mockOnApplyCoupon = jest.fn();

    render(<CouponInput onApplyCoupon={mockOnApplyCoupon} />);

    const input = screen.getByPlaceholderText(/ingresa cupón/i);
    const button = screen.getByRole('button', { name: /aplicar/i });

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    expect(mockOnApplyCoupon).not.toHaveBeenCalled();
  });

  test('debe convertir el código a mayúsculas', () => {
    const mockOnApplyCoupon = jest.fn();

    render(<CouponInput onApplyCoupon={mockOnApplyCoupon} />);

    const input = screen.getByPlaceholderText(/ingresa cupón/i);
    const button = screen.getByRole('button', { name: /aplicar/i });

    fireEvent.change(input, { target: { value: 'codigo-minusculas' } });
    fireEvent.click(button);

    expect(mockOnApplyCoupon).toHaveBeenCalledWith('CODIGO-MINUSCULAS');
  });

  test('debe tener el id correcto en el input', () => {
    const mockOnApplyCoupon = jest.fn();

    render(<CouponInput onApplyCoupon={mockOnApplyCoupon} />);

    const input = screen.getByPlaceholderText(/ingresa cupón/i);
    expect(input).toHaveAttribute('id', 'coupon-input');
  });

  test('debe tener el type text en el input', () => {
    const mockOnApplyCoupon = jest.fn();

    render(<CouponInput onApplyCoupon={mockOnApplyCoupon} />);

    const input = screen.getByPlaceholderText(/ingresa cupón/i);
    expect(input).toHaveAttribute('type', 'text');
  });
});
