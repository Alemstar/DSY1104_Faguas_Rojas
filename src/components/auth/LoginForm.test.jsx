import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';

describe('LoginForm Component', () => {
  test('debe renderizar el formulario con todos los campos', () => {
    const mockSetEmail = jest.fn();
    const mockSetPassword = jest.fn();
    const mockOnSubmit = jest.fn();

    render(
      <LoginForm
        email=""
        setEmail={mockSetEmail}
        password=""
        setPassword={mockSetPassword}
        onSubmit={mockOnSubmit}
        loading={false}
      />
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  test('debe llamar a setEmail cuando el usuario escribe en el campo email', () => {
    const mockSetEmail = jest.fn();
    const mockSetPassword = jest.fn();
    const mockOnSubmit = jest.fn();

    render(
      <LoginForm
        email=""
        setEmail={mockSetEmail}
        password=""
        setPassword={mockSetPassword}
        onSubmit={mockOnSubmit}
        loading={false}
      />
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(mockSetEmail).toHaveBeenCalledWith('test@example.com');
  });

  test('debe llamar a setPassword cuando el usuario escribe en el campo password', () => {
    const mockSetEmail = jest.fn();
    const mockSetPassword = jest.fn();
    const mockOnSubmit = jest.fn();

    render(
      <LoginForm
        email=""
        setEmail={mockSetEmail}
        password=""
        setPassword={mockSetPassword}
        onSubmit={mockOnSubmit}
        loading={false}
      />
    );

    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(mockSetPassword).toHaveBeenCalledWith('password123');
  });

  test('debe llamar a onSubmit cuando se envía el formulario', () => {
    const mockSetEmail = jest.fn();
    const mockSetPassword = jest.fn();
    const mockOnSubmit = jest.fn((e) => e.preventDefault());

    render(
      <LoginForm
        email="test@example.com"
        setEmail={mockSetEmail}
        password="password123"
        setPassword={mockSetPassword}
        onSubmit={mockOnSubmit}
        loading={false}
      />
    );

    const form = screen.getByRole('button', { name: /entrar/i }).closest('form');
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('debe deshabilitar el botón y mostrar "Verificando..." cuando loading es true', () => {
    const mockSetEmail = jest.fn();
    const mockSetPassword = jest.fn();
    const mockOnSubmit = jest.fn();

    render(
      <LoginForm
        email=""
        setEmail={mockSetEmail}
        password=""
        setPassword={mockSetPassword}
        onSubmit={mockOnSubmit}
        loading={true}
      />
    );

    const button = screen.getByRole('button', { name: /verificando/i });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Verificando...');
  });

  test('debe mostrar el mensaje de feedback cuando se proporciona', () => {
    const mockSetEmail = jest.fn();
    const mockSetPassword = jest.fn();
    const mockOnSubmit = jest.fn();

    render(
      <LoginForm
        email=""
        setEmail={mockSetEmail}
        password=""
        setPassword={mockSetPassword}
        onSubmit={mockOnSubmit}
        loading={false}
        feedback="Credenciales incorrectas"
      />
    );

    expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
  });

  test('debe validar que el campo email sea requerido', () => {
    const mockSetEmail = jest.fn();
    const mockSetPassword = jest.fn();
    const mockOnSubmit = jest.fn();

    render(
      <LoginForm
        email=""
        setEmail={mockSetEmail}
        password=""
        setPassword={mockSetPassword}
        onSubmit={mockOnSubmit}
        loading={false}
      />
    );

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeRequired();
  });

  test('debe validar que el campo password tenga minLength de 4 y maxLength de 10', () => {
    const mockSetEmail = jest.fn();
    const mockSetPassword = jest.fn();
    const mockOnSubmit = jest.fn();

    render(
      <LoginForm
        email=""
        setEmail={mockSetEmail}
        password=""
        setPassword={mockSetPassword}
        onSubmit={mockOnSubmit}
        loading={false}
      />
    );

    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute('minLength', '4');
    expect(passwordInput).toHaveAttribute('maxLength', '10');
  });
});
