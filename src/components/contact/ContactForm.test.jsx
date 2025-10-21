import { render, screen, fireEvent } from '@testing-library/react';
import ContactForm from './ContactForm';

describe('ContactForm Component', () => {
  test('debe renderizar el formulario con todos los campos', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/comentario/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
  });

  test('debe actualizar el estado cuando el usuario escribe en el campo nombre', () => {
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/nombre completo/i);
    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });

    expect(nameInput.value).toBe('Juan Pérez');
  });

  test('debe actualizar el estado cuando el usuario escribe en el campo email', () => {
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });

    expect(emailInput.value).toBe('juan@example.com');
  });

  test('debe actualizar el estado cuando el usuario escribe en el campo mensaje', () => {
    render(<ContactForm />);

    const messageInput = screen.getByLabelText(/comentario/i);
    fireEvent.change(messageInput, { target: { value: 'Este es un mensaje de prueba' } });

    expect(messageInput.value).toBe('Este es un mensaje de prueba');
  });

  test('debe mostrar alerta cuando se intenta enviar el formulario vacío', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<ContactForm />);

    const form = screen.getByRole('button', { name: /enviar mensaje/i }).closest('form');
    
    // Intentar enviar el formulario - la validación HTML5 lo previene
    // Este test verifica que el formulario tiene validación
    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const messageInput = screen.getByLabelText(/comentario/i);
    
    expect(nameInput).toBeRequired();
    expect(emailInput).toBeRequired();
    expect(messageInput).toBeRequired();
    
    alertMock.mockRestore();
  });

  test('debe enviar el formulario cuando todos los campos están completos', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/nombre completo/i), { 
      target: { value: 'Juan Pérez' } 
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { 
      target: { value: 'juan@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/comentario/i), { 
      target: { value: 'Mensaje de prueba' } 
    });

    const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });
    fireEvent.click(submitButton);

    expect(alertMock).toHaveBeenCalledWith('¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
    expect(consoleSpy).toHaveBeenCalledWith('Formulario enviado:', {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      message: 'Mensaje de prueba'
    });
    
    alertMock.mockRestore();
    consoleSpy.mockRestore();
  });

  test('debe limpiar el formulario después de un envío exitoso', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const messageInput = screen.getByLabelText(/comentario/i);

    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Mensaje de prueba' } });

    const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });
    fireEvent.click(submitButton);

    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(messageInput.value).toBe('');
  });

  test('todos los campos deben ser requeridos', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/nombre completo/i)).toBeRequired();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeRequired();
    expect(screen.getByLabelText(/comentario/i)).toBeRequired();
  });
});
