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
    localStorageMock.getItem.mockImplementation((key) => {
      const value = localStorageMock.getItem.mock.calls[0]?.[0] === key ? null : null
      return null
    })
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

    const { result } = renderHook(() => useCart(123))

    // Estado inicial debe ser loading
    expect(result.current.loading).toBe(true)
    expect(result.current.cart).toBeNull()

    // Esperar a que se complete la carga
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(cartService.createCart).toHaveBeenCalledWith(123)
    expect(result.current.cart).toEqual(mockCart)
  })



  test('debe manejar error al cargar carrito', async () => {
    localStorageMock.getItem.mockReturnValue('1')
    cartService.getCartById.mockRejectedValue(new Error('Error de red'))
    cartService.createCart.mockRejectedValue(new Error('Error de red'))

    const { result } = renderHook(() => useCart(123))

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
    cartService.addProductToCart.mockResolvedValue(updatedCart)
    cartService.getCartById.mockResolvedValue(updatedCart)

    const { result } = renderHook(() => useCart(123))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Agregar producto
    await act(async () => {
      await result.current.addProduct(101)
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
    cartService.removeProductFromCart.mockResolvedValue(updatedCart)
    cartService.getCartById.mockResolvedValue(updatedCart)

    const { result } = renderHook(() => useCart(123))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Eliminar producto
    await act(async () => {
      await result.current.removeProduct('Producto 1')
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(cartService.removeProductFromCart).toHaveBeenCalledWith('Producto 1', 1)
    expect(result.current.cart).toEqual(updatedCart)
  })

  test('debe manejar error cuando no hay idCustomer', async () => {
    const { result } = renderHook(() => useCart(null))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('ID de cliente no proporcionado')
  })

  test('debe manejar error al agregar producto sin idProduct', async () => {
    const mockCart = {
      id_cart: 1,
      id_customer: 123,
      Products: [],
      total: 0
    }

    localStorageMock.getItem.mockReturnValue(null)
    cartService.createCart.mockResolvedValue(mockCart)

    const { result } = renderHook(() => useCart(123))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.addProduct(null)
    })

    expect(result.current.error).toBe('ID de producto no proporcionado')
  })

  test('debe manejar error al eliminar producto sin productName', async () => {
    const mockCart = {
      id_cart: 1,
      id_customer: 123,
      Products: ['Producto 1'],
      total: 25000
    }

    localStorageMock.getItem.mockReturnValue(null)
    cartService.createCart.mockResolvedValue(mockCart)

    const { result } = renderHook(() => useCart(123))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.removeProduct(null)
    })

    expect(result.current.error).toBe('Nombre de producto no proporcionado')
  })
})
