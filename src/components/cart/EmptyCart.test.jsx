import { render, screen } from '@testing-library/react';
import EmptyCart from './EmptyCart';

describe('EmptyCart Component', () => {
  test('debe renderizar el mensaje de carrito vacío', () => {
    render(<EmptyCart />);

    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
  });

  test('debe tener la clase CSS correcta', () => {
    const { container } = render(<EmptyCart />);

    const emptyCartDiv = container.querySelector('.empty-cart');
    expect(emptyCartDiv).toBeInTheDocument();
  });

  test('debe renderizar el mensaje con la clase correcta', () => {
    const { container } = render(<EmptyCart />);

    const message = container.querySelector('.empty-cart-message');
    expect(message).toBeInTheDocument();
    expect(message).toHaveTextContent('Tu carrito está vacío.');
  });

  test('debe renderizar sin props', () => {
    const { container } = render(<EmptyCart />);

    expect(container.firstChild).toBeInTheDocument();
  });

  test('debe ser un componente simple sin interacciones', () => {
    const { container } = render(<EmptyCart />);

    // No debe tener botones
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    
    // No debe tener inputs
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
