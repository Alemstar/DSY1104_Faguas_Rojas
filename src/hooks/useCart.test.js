import { renderHook, act, waitFor } from '@testing-library/react'
import { useCart } from './useCart'
import * as cartService from '../api/cartService'

// Mock del cartService
jest.mock('../api/cartService')

// Mock de localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    clear: jest.fn(() => {
      store = {}
    })
  }
})()

global.localStorage = localStorageMock

describe('useCart Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.clear()
    // Reset getItem to default behavior after each test
    localStorageMock.getItem.mockReturnValue(null)
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    console.log.mockRestore()
    console.error.mockRestore()
    console.warn.mockRestore()
  })

  test('debe crear un nuevo carrito cuando no existe uno almacenado', async () => {
    const mockCart = {
      id_cart: 1,
      id_customer: 123,
      Products: [],
      total: 0
    }

    localStorageMock.getItem.mockReturnValue(null)
    cartService.createCart.mockResolvedValue(mockCart)
    cartService.getCart.mockResolvedValue(mockCart)

    const { result } = renderHook(() => useCart())

    // Estado inicial no debe estar cargando hasta que llamemos loadCart
    expect(result.current.loading).toBe(false)
    expect(result.current.cart).toBeNull()

    // Cargar el carrito
    await act(async () => {
      await result.current.loadCart(123)
    })

    // Esperar a que se complete la carga
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(cartService.createCart).toHaveBeenCalledWith(123)
    expect(result.current.cart).toEqual(mockCart)
  })

  test('debe manejar error al cargar carrito', async () => {
    localStorageMock.getItem.mockReturnValue('1')
    cartService.getCart.mockRejectedValue(new Error('Error de red'))
    cartService.createCart.mockRejectedValue(new Error('Error de red'))

    const { result } = renderHook(() => useCart())

    await act(async () => {
      await result.current.loadCart(123)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Error de red')
  })

  test('debe agregar un producto al carrito', async () => {
    const initialCart = {
      id_cart: 1,
      id_customer: 123,
      Products: [],
      total: 0
    }

    const updatedCart = {
      id_cart: 1,
      id_customer: 123,
      Products: ['Producto 1'],
      total: 25000
    }

    localStorageMock.getItem.mockReturnValue(null)
    cartService.createCart.mockResolvedValue(initialCart)
    cartService.getCart.mockResolvedValue(initialCart)
    cartService.addProductToCart.mockResolvedValue(updatedCart)

    const { result } = renderHook(() => useCart())

    // Cargar carrito
    await act(async () => {
      await result.current.loadCart(123)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Mock for getCart after adding product
    cartService.getCart.mockResolvedValue(updatedCart)

    // Agregar producto
    await act(async () => {
      await result.current.addItem(101)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(cartService.addProductToCart).toHaveBeenCalledWith(101, 1)
    expect(result.current.cart).toEqual(updatedCart)
  })

  test('debe eliminar un producto del carrito', async () => {
    const initialCart = {
      id_cart: 1,
      id_customer: 123,
      Products: ['Producto 1'],
      total: 25000
    }

    const updatedCart = {
      id_cart: 1,
      id_customer: 123,
      Products: [],
      total: 0
    }

    localStorageMock.getItem.mockReturnValue(null)
    cartService.createCart.mockResolvedValue(initialCart)
    cartService.getCart.mockResolvedValue(initialCart)
    cartService.removeProductFromCart.mockResolvedValue(updatedCart)

    const { result } = renderHook(() => useCart())

    // Cargar carrito
    await act(async () => {
      await result.current.loadCart(123)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Mock for getCart after removing product
    cartService.getCart.mockResolvedValue(updatedCart)

    // Eliminar producto
    await act(async () => {
      await result.current.removeItem('Producto 1')
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(cartService.removeProductFromCart).toHaveBeenCalledWith('Producto 1', 1)
    expect(result.current.cart).toEqual(updatedCart)
  })

  test('debe manejar error cuando no hay idCustomer', async () => {
    const { result } = renderHook(() => useCart())

    await act(async () => {
      await result.current.loadCart(null)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // No hay error, simplemente no se carga nada
    expect(result.current.cart).toBeNull()
  })

  test('debe manejar error al agregar producto sin carrito', async () => {
    const { result } = renderHook(() => useCart())

    // Intentar agregar sin cargar primero
    await act(async () => {
      await result.current.addItem(101)
    })

    expect(result.current.error).toBe('No cart available')
  })

  test('debe manejar error al eliminar producto sin carrito', async () => {
    const { result } = renderHook(() => useCart())

    // Intentar eliminar sin cargar primero
    await act(async () => {
      await result.current.removeItem('Producto 1')
    })

    expect(result.current.error).toBe('No cart available')
  })
})
