import { render, screen, fireEvent } from '@testing-library/react';
import CartSummary from './CartSummary';

describe('CartSummary Component', () => {
  const defaultProps = {
    subtotal: 30000,
    discount: 0,
    total: 30000,
    appliedCoupon: null,
    onApplyCoupon: jest.fn(),
    onClearCart: jest.fn(),
    onCheckout: jest.fn(),
    isEmpty: false
  };

  test('debe renderizar el resumen del carrito con el total', () => {
    render(<CartSummary {...defaultProps} />);

    expect(screen.getByText('TOTAL:')).toBeInTheDocument();
    expect(screen.getByText(/30\.000/)).toBeInTheDocument();
  });

  test('debe renderizar todos los beneficios disponibles', () => {
    render(<CartSummary {...defaultProps} />);

    expect(screen.getByText(/50% para mayores de 50 años/i)).toBeInTheDocument();
    expect(screen.getByText(/10% con código/i)).toBeInTheDocument();
    expect(screen.getByText(/FELICESS0/i)).toBeInTheDocument();
    expect(screen.getByText(/Torta gratis/i)).toBeInTheDocument();
  });

  test('debe renderizar el componente CouponInput', () => {
    render(<CartSummary {...defaultProps} />);

    expect(screen.getByLabelText(/cupón/i)).toBeInTheDocument();
  });

  test('debe mostrar la información del cupón aplicado cuando existe', () => {
    const propsWithCoupon = {
      ...defaultProps,
      appliedCoupon: 'FELICESS0',
      discount: 3000,
      total: 27000
    };

    render(<CartSummary {...propsWithCoupon} />);

    expect(screen.getByText(/Cupón aplicado:/i)).toBeInTheDocument();
    // Buscar dentro del contenedor del cupón aplicado
    const appliedCouponDiv = screen.getByText(/Cupón aplicado:/i).closest('.applied-coupon');
    expect(appliedCouponDiv).toHaveTextContent('FELICESS0');
    expect(screen.getByText(/Descuento:/i)).toBeInTheDocument();
    expect(screen.getByText(/3\.000/)).toBeInTheDocument();
  });

  test('debe llamar a onClearCart cuando se hace clic en VACIAR', () => {
    const mockOnClearCart = jest.fn();

    render(
      <CartSummary
        {...defaultProps}
        onClearCart={mockOnClearCart}
      />
    );

    const clearButton = screen.getByRole('button', { name: /vaciar/i });
    fireEvent.click(clearButton);

    expect(mockOnClearCart).toHaveBeenCalled();
  });

  test('debe llamar a onCheckout cuando se hace clic en PAGAR', () => {
    const mockOnCheckout = jest.fn();

    render(
      <CartSummary
        {...defaultProps}
        onCheckout={mockOnCheckout}
      />
    );

    const checkoutButton = screen.getByRole('button', { name: /pagar/i });
    fireEvent.click(checkoutButton);

    expect(mockOnCheckout).toHaveBeenCalled();
  });

  test('debe deshabilitar los botones cuando el carrito está vacío', () => {
    const emptyCartProps = {
      ...defaultProps,
      isEmpty: true
    };

    render(<CartSummary {...emptyCartProps} />);

    const clearButton = screen.getByRole('button', { name: /vaciar/i });
    const checkoutButton = screen.getByRole('button', { name: /pagar/i });

    expect(clearButton).toBeDisabled();
    expect(checkoutButton).toBeDisabled();
  });

  test('debe formatear correctamente los precios en formato chileno', () => {
    const propsWithLargeAmount = {
      ...defaultProps,
      total: 1500000,
      discount: 150000
    };

    render(
      <CartSummary
        {...propsWithLargeAmount}
        appliedCoupon="DESCUENTO"
      />
    );

    expect(screen.getByText(/1\.500\.000/)).toBeInTheDocument();
    expect(screen.getByText(/150\.000/)).toBeInTheDocument();
  });

  test('debe propagar onApplyCoupon al componente CouponInput', () => {
    const mockOnApplyCoupon = jest.fn();

    render(
      <CartSummary
        {...defaultProps}
        onApplyCoupon={mockOnApplyCoupon}
      />
    );

    const input = screen.getByPlaceholderText(/ingresa cupón/i);
    const applyButton = screen.getByRole('button', { name: /aplicar/i });

    fireEvent.change(input, { target: { value: 'TEST123' } });
    fireEvent.click(applyButton);

    expect(mockOnApplyCoupon).toHaveBeenCalledWith('TEST123');
  });

  test('debe tener 3 beneficios en la lista', () => {
    const { container } = render(<CartSummary {...defaultProps} />);

    const benefitItems = container.querySelectorAll('.benefit-item');
    expect(benefitItems).toHaveLength(3);
  });

  test('debe renderizar el título de beneficios', () => {
    render(<CartSummary {...defaultProps} />);

    expect(screen.getByText('Beneficios disponibles:')).toBeInTheDocument();
  });

  test('no debe mostrar el cupón aplicado cuando no hay cupón', () => {
    render(<CartSummary {...defaultProps} />);

    expect(screen.queryByText(/Cupón aplicado:/i)).not.toBeInTheDocument();
  });
});
