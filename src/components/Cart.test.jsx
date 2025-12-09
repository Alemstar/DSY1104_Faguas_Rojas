import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Cart from './Cart'
import { useCart } from '../hooks/useCart'

// Mock del hook useCart
jest.mock('../hooks/useCart')

describe('Cart Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('debe mostrar estado de carga', () => {
    useCart.mockReturnValue({
      cart: null,
      loading: true,
      error: null,
      removeProduct: jest.fn()
    })

    render(<Cart idCustomer={123} />)
    
    expect(screen.getByText('Cargando carrito...')).toBeInTheDocument()
  })

  test('debe mostrar error cuando hay un error', () => {
    const errorMessage = 'Error de conexión'
    useCart.mockReturnValue({
      cart: null,
      loading: false,
      error: errorMessage,
      removeProduct: jest.fn()
    })

    render(<Cart idCustomer={123} />)
    
    expect(screen.getByText('Error al cargar el carrito')).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  test('debe mostrar mensaje de carrito vacío', () => {
    useCart.mockReturnValue({
      cart: {
        id_cart: 1,
        id_customer: 123,
        Products: [],
        total: 0
      },
      loading: false,
      error: null,
      removeProduct: jest.fn()
    })

    render(<Cart idCustomer={123} />)
    
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
    expect(screen.getByText('Agrega productos para comenzar a comprar')).toBeInTheDocument()
  })

  test('debe mostrar la información del carrito', () => {
    const mockCart = {
      id_cart: 1,
      id_customer: 123,
      Products: ['Producto 1', 'Producto 2'],
      total: 50000
    }

    useCart.mockReturnValue({
      cart: mockCart,
      loading: false,
      error: null,
      removeProduct: jest.fn()
    })

    render(<Cart idCustomer={123} />)
    
    expect(screen.getByText('Carrito de Compras')).toBeInTheDocument()
    expect(screen.getByText(/ID Carrito:/)).toBeInTheDocument()
    expect(screen.getByText(/Cliente:/)).toBeInTheDocument()
    expect(screen.getByText(/Total:/)).toBeInTheDocument()
  })

  test('debe mostrar los productos del carrito', () => {
    const mockCart = {
      id_cart: 1,
      id_customer: 123,
      Products: ['Producto 1', 'Producto 2', 'Producto 3'],
      total: 75000
    }

    useCart.mockReturnValue({
      cart: mockCart,
      loading: false,
      error: null,
      removeProduct: jest.fn()
    })

    render(<Cart idCustomer={123} />)
    
    expect(screen.getByText('Productos (3)')).toBeInTheDocument()
    expect(screen.getByText('Producto 1')).toBeInTheDocument()
    expect(screen.getByText('Producto 2')).toBeInTheDocument()
    expect(screen.getByText('Producto 3')).toBeInTheDocument()
  })

  test('debe tener botones de eliminar para cada producto', () => {
    const mockCart = {
      id_cart: 1,
      id_customer: 123,
      Products: ['Producto 1', 'Producto 2'],
      total: 50000
    }

    useCart.mockReturnValue({
      cart: mockCart,
      loading: false,
      error: null,
      removeProduct: jest.fn()
    })

    render(<Cart idCustomer={123} />)
    
    const removeButtons = screen.getAllByText('Eliminar')
    expect(removeButtons).toHaveLength(2)
  })

  test('debe llamar removeProduct cuando se hace clic en eliminar y se confirma', async () => {
    const mockRemoveProduct = jest.fn()
    const mockCart = {
      id_cart: 1,
      id_customer: 123,
      Products: ['Producto Test'],
      total: 25000
    }

    useCart.mockReturnValue({
      cart: mockCart,
      loading: false,
      error: null,
      removeProduct: mockRemoveProduct
    })

    // Mock window.confirm
    window.confirm = jest.fn(() => true)

    render(<Cart idCustomer={123} />)
    
    const removeButton = screen.getByRole('button', { name: /Eliminar Producto Test/i })
    removeButton.click()

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('¿Deseas eliminar "Producto Test" del carrito?')
      expect(mockRemoveProduct).toHaveBeenCalledWith('Producto Test')
    })
  })

  test('no debe llamar removeProduct cuando se cancela la confirmación', async () => {
    const mockRemoveProduct = jest.fn()
    const mockCart = {
      id_cart: 1,
      id_customer: 123,
      Products: ['Producto Test'],
      total: 25000
    }

    useCart.mockReturnValue({
      cart: mockCart,
      loading: false,
      error: null,
      removeProduct: mockRemoveProduct
    })

    // Mock window.confirm para retornar false
    window.confirm = jest.fn(() => false)

    render(<Cart idCustomer={123} />)
    
    const removeButton = screen.getByRole('button', { name: /Eliminar Producto Test/i })
    removeButton.click()

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled()
      expect(mockRemoveProduct).not.toHaveBeenCalled()
    })
  })
})
