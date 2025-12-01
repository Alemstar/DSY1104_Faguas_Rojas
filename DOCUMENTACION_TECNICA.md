# Documentación Técnica - Pastelería Mil Sabores

## Índice
1. [React Router](#react-router)
2. [Loaders](#loaders)
3. [Hooks](#hooks)
4. [LocalStorage](#localstorage)
5. [Ciclo de Vida](#ciclo-de-vida)
6. [Flujo de Carga de Productos](#flujo-de-carga-de-productos)

---

## Tecnologías
- **React** + **React Router v6**
- **LocalStorage** para persistencia
- **Hooks** para gestión de estado

---

## React Router

### Configuración (`routes.jsx`)

```jsx
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home, loader: homeLoader },
      {
        path: "productos",
        children: [
          { index: true, Component: Products, loader: productsLoader },
          { path: ":code", Component: ProductDetail, loader: productDetailLoader }
        ]
      },
      { path: "carrito", Component: Cart, loader: cartLoader }
    ]
  }
])
```

**Características:**
- **Loaders**: Se ejecutan ANTES de renderizar (cargan datos)
- **Rutas anidadas**: Root contiene `<Outlet />` para hijos
- **Parámetros**: `:code` captura valores dinámicos
- **Query params**: `/productos?q=chocolate&category=tortas`

### Hooks Principales

```jsx
const navigate = useNavigate()           // navigate('/productos')
const [searchParams] = useSearchParams() // searchParams.get('q')
const datos = useLoaderData()            // Datos del loader
const { code } = useParams()             // Parámetros de ruta
```

---

## Loaders

**Loaders** cargan datos ANTES de renderizar el componente.

### Products Loader

```javascript
// Función loader que se ejecuta ANTES de renderizar el componente Products
// React Router la invoca automáticamente cuando navegamos a /productos
export async function productsLoader({ request }) {
  // 1. Crear objeto URL desde la petición para acceder a los query params
  // Ejemplo: /productos?q=chocolate&category=tortas&minPrice=5000&maxPrice=20000
  const url = new URL(request.url)
  
  // 2. Extraer parámetros de búsqueda desde la URL
  const q = url.searchParams.get('q')                  // Término de búsqueda: "chocolate"
  const category = url.searchParams.get('category')    // Categoría: "tortas"
  const minPrice = Number(url.searchParams.get('minPrice'))  // Precio mínimo: 5000
  const maxPrice = Number(url.searchParams.get('maxPrice'))  // Precio máximo: 20000

  // 3. Llamar al servicio que obtiene productos (simula API)
  // Filtra por texto de búsqueda (q) y categoría
  const data = await getProducts({ q, category })
  
  // 4. Aplicar filtro de rango de precios
  // Solo muestra productos con precio entre minPrice y maxPrice
  let filtered = data.filter(p => p.precioCLP >= minPrice && p.precioCLP <= maxPrice)
  
  // 5. Retornar datos filtrados
  // El componente Products accederá a esto con useLoaderData()
  return filtered
}
```

### Product Detail Loader

```javascript
export async function productDetailLoader({ params }) {
  const producto = await getProductById(params.code)
  const todosLosProductos = await getProducts()
  
  const productosRelacionados = todosLosProductos
    .filter(p => p.categoriaId === producto.categoriaId && p.code !== params.code)
    .slice(0, 4)
  
  return { producto, productosRelacionados }
}
```

### Cart Loader

```javascript
export async function cartLoader() {
  const savedCart = localStorage.getItem('cart')
  if (!savedCart) return { cartItems: [] }

  const cart = JSON.parse(savedCart)
  
  // Validar productos (verificar que existan y actualizar precios)
  const validatedItems = await Promise.all(
    cart.map(async (item) => {
      if (item.producto.code === 'CUSTOM') return item
      const producto = await getProductById(item.producto.code)
      return producto ? { ...item, producto } : null
    })
  )

  const cartItems = validatedItems.filter(item => item !== null)
  
  // Actualizar localStorage si hubo cambios
  if (cartItems.length !== cart.length) {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }

  return { cartItems }
}
```

---

## Hooks

### useState - Estado Local

```jsx
const [quantity, setQuantity] = useState(1)
const [selectedSize, setSelectedSize] = useState("")
const [cartItems, setCartItems] = useState([])

// Actualizar estado
setQuantity(5)
setSelectedSize("mediano")
```

### useEffect - Efectos Secundarios

```jsx
// 1. Ejecutar al montar/desmontar
useEffect(() => {
  console.log('Componente montado')
  
  return () => {
    console.log('Componente desmontado - cleanup')
  }
}, [])

// 2. Ejecutar cuando cambia una dependencia
useEffect(() => {
  setProductosFiltrados(productos)
}, [productos])

// 3. Event Listeners
useEffect(() => {
  const handleUpdate = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(cart)
  }
  
  window.addEventListener('cartUpdated', handleUpdate)
  return () => window.removeEventListener('cartUpdated', handleUpdate)
}, [])
```

### Otros Hooks de React Router

```jsx
const navigate = useNavigate()        // Navegación programática
const { code } = useParams()          // Parámetros de URL
const [searchParams] = useSearchParams()  // Query params
const productos = useLoaderData()     // Datos del loader
```

---

## LocalStorage

### Estructura del Carrito

```javascript
[
  {
    "id": "TRT001-mediano-1698765432100",
    "producto": { "code": "TRT001", "nombre": "Torta Chocolate", "precioCLP": 15000 },
    "size": "mediano",
    "quantity": 2,
    "personalizationMessage": "Feliz Cumpleaños"
  }
]
```

### Operaciones CRUD

```javascript
// LEER
const cart = JSON.parse(localStorage.getItem('cart') || '[]')

// CREAR/AÑADIR
const newItem = { id: `${code}-${size}-${Date.now()}`, producto, size, quantity }
const updatedCart = [...currentCart, newItem]
localStorage.setItem('cart', JSON.stringify(updatedCart))

// ACTUALIZAR
const updated = cart.map(item => 
  item.id === itemId ? { ...item, quantity: newQuantity } : item
)
localStorage.setItem('cart', JSON.stringify(updated))

// ELIMINAR
const filtered = cart.filter(item => item.id !== itemId)
localStorage.setItem('cart', JSON.stringify(filtered))
```

### Sincronización entre Componentes

```javascript
// Componente A: Emite evento
localStorage.setItem('cart', JSON.stringify(cart))
window.dispatchEvent(new Event('cartUpdated'))

// Componente B: Escucha evento
useEffect(() => {
  const handleUpdate = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(cart)
  }
  
  window.addEventListener('cartUpdated', handleUpdate)
  return () => window.removeEventListener('cartUpdated', handleUpdate)
}, [])
```

### Autenticación

```javascript
// Login
const payload = { email, nombre, apellidos, at: new Date().toISOString() }
localStorage.setItem('sesionIniciada', JSON.stringify(payload))

// Logout
localStorage.removeItem('sesionIniciada')

// Verificar
const sesion = JSON.parse(localStorage.getItem('sesionIniciada') || 'null')
const isAuthenticated = sesion !== null
```

---

## Ciclo de Vida

### Fases de un Componente

```jsx
export default function Cart() {
  const { cartItems: initialCartItems } = useLoaderData()
  const [cartItems, setCartItems] = useState(initialCartItems)

  // 1. MONTAJE - Se ejecuta una vez al crear el componente
  useEffect(() => {
    const handleUpdate = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartItems(cart)
    }
    
    window.addEventListener('cartUpdated', handleUpdate)
    
    // 2. DESMONTAJE - Cleanup al destruir el componente
    return () => {
      window.removeEventListener('cartUpdated', handleUpdate)
    }
  }, [])

  // 3. ACTUALIZACIÓN - Se ejecuta cuando cambia initialCartItems
  useEffect(() => {
    setCartItems(initialCartItems)
  }, [initialCartItems])

  return <div>{/* JSX */}</div>
}
```

### Diagrama del Ciclo

```
NAVEGACIÓN → LOADER → RENDER → COMMIT → EFFECTS → UPDATES → UNMOUNT
    ↓           ↓         ↓        ↓         ↓         ↓         ↓
  Click    Carga     JSX     DOM     Setup   setState  Cleanup
           datos   preparado actualiza listeners re-render listeners
```

---

## Flujo de Carga de Productos

### 1. Búsqueda de Productos

**Usuario busca "chocolate" en categoría "tortas"**

```
Usuario → SearchBar → navigate('/productos?q=chocolate&category=tortas')
                                    ↓
                          productsLoader({ request })
                                    ↓
                    Parsear query params (q, category, minPrice, maxPrice)
                                    ↓
                      getProducts({ q: "chocolate", category: "tortas" })
                                    ↓
              Filtrar por categoría y búsqueda en products.json
                                    ↓
                         Aplicar filtros de precio
                                    ↓
                          Retornar productos filtrados
                                    ↓
              Products Component → useLoaderData() → Renderizar
```

### 2. Ver Detalle de Producto

**Usuario hace clic en producto TRT001**

```
Click "Ver detalle" → navigate('/productos/TRT001')
                                    ↓
                    productDetailLoader({ params: { code: 'TRT001' } })
                                    ↓
                         getProductById('TRT001')
                                    ↓
                    getProducts() para productos relacionados
                                    ↓
    Filtrar por misma categoría (max 4) → { producto, productosRelacionados }
                                    ↓
                    ProductDetail → useLoaderData()
                                    ↓
                    useState para size, quantity, message
                                    ↓
                         Renderizar formulario
```

### 3. Añadir al Carrito

```jsx
const handleAddToCart = () => {
  // 1. Leer carrito actual
  const currentCart = JSON.parse(localStorage.getItem('cart') || '[]')
  
  // 2. Crear item
  const newItem = {
    id: `${producto.code}-${selectedSize}-${Date.now()}`,
    producto,
    size: selectedSize,
    quantity,
    personalizationMessage
  }
  
  // 3. Verificar si ya existe
  const existingIndex = currentCart.findIndex(item => 
    item.producto.code === producto.code && 
    item.size === selectedSize &&
    item.personalizationMessage === personalizationMessage
  )
  
  let updatedCart
  if (existingIndex !== -1) {
    // Incrementar cantidad
    updatedCart = [...currentCart]
    updatedCart[existingIndex].quantity += quantity
  } else {
    // Añadir nuevo
    updatedCart = [...currentCart, newItem]
  }
  
  // 4. Guardar
  localStorage.setItem('cart', JSON.stringify(updatedCart))
  
  // 5. Notificar (actualiza contador en navbar)
  window.dispatchEvent(new Event('cartUpdated'))
}
```

### 4. Ver Carrito

```
navigate('/carrito') → cartLoader()
                            ↓
                  Leer localStorage('cart')
                            ↓
        Validar cada producto con getProductById()
                            ↓
            Actualizar precios y datos
                            ↓
          Filtrar productos que no existen
                            ↓
    Actualizar localStorage si hubo cambios
                            ↓
              Cart Component recibe cartItems validados
                            ↓
    useEffect escucha 'cartUpdated' para sincronización
                            ↓
    Renderizar CartItem[], CartSummary, CouponInput
```

### 5. Sincronización en Tiempo Real

```
ProductDetail añade item → localStorage.setItem('cart', ...)
                                    ↓
                    window.dispatchEvent('cartUpdated')
                                    ↓
                NavBarRoot escucha evento (useEffect)
                                    ↓
                    Leer cart desde localStorage
                                    ↓
                Calcular total: cart.reduce((sum, item) => sum + item.quantity, 0)
                                    ↓
                    setCartCount(total) → Badge se actualiza
```

### Diagrama Completo

```
┌──────────────┐
│   Usuario    │
└──────┬───────┘
       │ Click "Productos"
       ↓
┌──────────────────────────────────────┐
│  productsLoader()                    │
│  - Parsear URL params                │
│  - getProducts({ q, category })      │
│  - Filtrar por precio                │
└──────┬───────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│  Products Component                  │
│  - useLoaderData() → productos       │
│  - useState → productosFiltrados     │
│  - Renderizar ProductGrid            │
└──────┬───────────────────────────────┘
       │ Click producto
       ↓
┌──────────────────────────────────────┐
│  productDetailLoader({ params })     │
│  - getProductById(code)              │
│  - Filtrar relacionados              │
└──────┬───────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│  ProductDetail Component             │
│  - useLoaderData()                   │
│  - useState(size, quantity, msg)     │
│  - handleAddToCart()                 │
└──────┬───────────────────────────────┘
       │ Añadir al carrito
       ↓
┌──────────────────────────────────────┐
│  LocalStorage                        │
│  - Leer cart actual                  │
│  - Añadir/actualizar item            │
│  - Guardar cart                      │
│  - dispatchEvent('cartUpdated')      │
└──────┬───────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│  NavBarRoot                          │
│  - useEffect escucha 'cartUpdated'   │
│  - Actualizar badge contador         │
└──────┬───────────────────────────────┘
       │ Click carrito
       ↓
┌──────────────────────────────────────┐
│  cartLoader()                        │
│  - Leer localStorage                 │
│  - Validar productos                 │
│  - Actualizar precios                │
└──────┬───────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│  Cart Component                      │
│  - useLoaderData() → cartItems       │
│  - useState para gestión             │
│  - Renderizar items y resumen        │
└──────────────────────────────────────┘
```
