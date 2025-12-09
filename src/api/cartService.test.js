import { getCartById, createCart, addProductToCart, removeProductFromCart } from './cartService'

// Mock global fetch
global.fetch = jest.fn()

describe('cartService', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    fetch.mockClear()
    // Mock de console.log y console.error para los tests
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    console.log.mockRestore()
    console.error.mockRestore()
  })

  describe('getCartById', () => {
    test('debe obtener un carrito exitosamente', async () => {
      const mockCart = {
        id_cart: 1,
        id_customer: 123,
        Products: ['Producto 1', 'Producto 2'],
        total: 50000
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart
      })

      const result = await getCartById(1)

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/cart/1',
        expect.objectContaining({
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        })
      )
      expect(result).toEqual(mockCart)
    })

    test('debe lanzar error si idCart no se proporciona', async () => {
      await expect(getCartById()).rejects.toThrow('idCart es requerido')
      expect(fetch).not.toHaveBeenCalled()
    })

    test('debe lanzar error si la petición falla', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Carrito no encontrado'
      })

      await expect(getCartById(999)).rejects.toThrow('Error al obtener carrito')
    })
  })

  describe('createCart', () => {
    test('debe crear un carrito exitosamente', async () => {
      const mockCart = {
        id_cart: 2,
        id_customer: 456,
        Products: [],
        total: 0
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart
      })

      const result = await createCart(456)

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/cart',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id_customer: 456 })
        })
      )
      expect(result).toEqual(mockCart)
    })

    test('debe lanzar error si idCustomer no se proporciona', async () => {
      await expect(createCart()).rejects.toThrow('idCustomer es requerido')
      expect(fetch).not.toHaveBeenCalled()
    })

    test('debe lanzar error si la petición falla', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => 'Datos inválidos'
      })

      await expect(createCart(123)).rejects.toThrow('Error al crear carrito')
    })
  })

  describe('addProductToCart', () => {
    test('debe agregar un producto exitosamente', async () => {
      const mockCart = {
        id_cart: 1,
        id_customer: 123,
        Products: ['Producto 1'],
        total: 25000
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart
      })

      const result = await addProductToCart(101, 1)

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/cart/add',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id_product: 101,
            id_cart: 1
          })
        })
      )
      expect(result).toEqual(mockCart)
    })

    test('debe lanzar error si idProduct no se proporciona', async () => {
      await expect(addProductToCart(null, 1)).rejects.toThrow('idProduct es requerido')
      expect(fetch).not.toHaveBeenCalled()
    })

    test('debe lanzar error si idCart no se proporciona', async () => {
      await expect(addProductToCart(101, null)).rejects.toThrow('idCart es requerido')
      expect(fetch).not.toHaveBeenCalled()
    })
  })

  describe('removeProductFromCart', () => {
    test('debe eliminar un producto exitosamente', async () => {
      const mockCart = {
        id_cart: 1,
        id_customer: 123,
        Products: [],
        total: 0
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart
      })

      const result = await removeProductFromCart('Producto 1', 1)

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/cart/remove',
        expect.objectContaining({
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            product_name: 'Producto 1',
            id_cart: 1
          })
        })
      )
      expect(result).toEqual(mockCart)
    })

    test('debe lanzar error si productName no se proporciona', async () => {
      await expect(removeProductFromCart(null, 1)).rejects.toThrow('productName es requerido')
      expect(fetch).not.toHaveBeenCalled()
    })

    test('debe lanzar error si idCart no se proporciona', async () => {
      await expect(removeProductFromCart('Producto 1', null)).rejects.toThrow('idCart es requerido')
      expect(fetch).not.toHaveBeenCalled()
    })
  })
})
