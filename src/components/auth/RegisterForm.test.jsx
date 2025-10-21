import { render, screen, fireEvent } from '@testing-library/react';
import RegisterForm from './RegisterForm';

describe('RegisterForm Component', () => {
  const mockForm = {
    nombre: '',
    apellidos: '',
    email: '',
    fechaNacimiento: '',
    password: '',
    codigoPromo: ''
  };

  test('debe renderizar todos los campos del formulario', () => {
    const mockUpdateField = jest.fn();
    const mockOnSubmit = jest.fn();

    const { container } = render(
      <RegisterForm
        form={mockForm}
        updateField={mockUpdateField}
        onSubmit={mockOnSubmit}
      />
    );

    expect(container.querySelector('input[name="nombre"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="apellidos"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="email"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="fechaNacimiento"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="password"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="codigoPromo"]')).toBeInTheDocument();
  });

  test('debe llamar a updateField cuando el usuario escribe en el campo nombre', () => {
    const mockUpdateField = jest.fn();
    const mockOnSubmit = jest.fn();

    const { container } = render(
      <RegisterForm
        form={mockForm}
        updateField={mockUpdateField}
        onSubmit={mockOnSubmit}
      />
    );

    const nombreInput = container.querySelector('input[name="nombre"]');
    fireEvent.change(nombreInput, { target: { name: 'nombre', value: 'Juan' } });

    expect(mockUpdateField).toHaveBeenCalled();
  });

  test('debe mostrar el botón de registro', () => {
    const mockUpdateField = jest.fn();
    const mockOnSubmit = jest.fn();

    render(
      <RegisterForm
        form={mockForm}
        updateField={mockUpdateField}
        onSubmit={mockOnSubmit}
      />
    );

    const button = screen.getByRole('button', { name: /registrar/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-primary');
  });

  test('debe llamar a onSubmit cuando se envía el formulario', () => {
    const mockUpdateField = jest.fn();
    const mockOnSubmit = jest.fn((e) => e.preventDefault());

    render(
      <RegisterForm
        form={mockForm}
        updateField={mockUpdateField}
        onSubmit={mockOnSubmit}
      />
    );

    const form = screen.getByRole('button', { name: /registrar/i }).closest('form');
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('debe mostrar el mensaje de feedback cuando se proporciona', () => {
    const mockUpdateField = jest.fn();
    const mockOnSubmit = jest.fn();

    render(
      <RegisterForm
        form={mockForm}
        updateField={mockUpdateField}
        onSubmit={mockOnSubmit}
        feedback="Usuario registrado exitosamente"
      />
    );

    expect(screen.getByText('Usuario registrado exitosamente')).toBeInTheDocument();
  });

  test('debe tener el campo código promo como opcional (sin required)', () => {
    const mockUpdateField = jest.fn();
    const mockOnSubmit = jest.fn();

    render(
      <RegisterForm
        form={mockForm}
        updateField={mockUpdateField}
        onSubmit={mockOnSubmit}
      />
    );

    const inputs = screen.getAllByRole('textbox');
    const codigoPromoInput = inputs.find(input => input.name === 'codigoPromo');
    expect(codigoPromoInput).not.toBeRequired();
  });

  test('debe validar que el campo password sea requerido y tenga límites', () => {
    const mockUpdateField = jest.fn();
    const mockOnSubmit = jest.fn();

    const { container } = render(
      <RegisterForm
        form={mockForm}
        updateField={mockUpdateField}
        onSubmit={mockOnSubmit}
      />
    );

    const passwordInput = container.querySelector('input[name="password"]');
    expect(passwordInput).toBeRequired();
    expect(passwordInput).toHaveAttribute('minLength', '4');
    expect(passwordInput).toHaveAttribute('maxLength', '10');
  });

  test('debe renderizar con un título personalizado', () => {
    const mockUpdateField = jest.fn();
    const mockOnSubmit = jest.fn();

    render(
      <RegisterForm
        title="Crear nueva cuenta"
        form={mockForm}
        updateField={mockUpdateField}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Crear nueva cuenta')).toBeInTheDocument();
  });
});
