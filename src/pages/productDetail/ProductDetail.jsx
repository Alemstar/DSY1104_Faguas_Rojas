import { useParams, useLoaderData, useNavigate } from "react-router-dom"
import { useState } from "react"
import Breadcrumb from "../../components/productDetail/Breadcrumb"
import SizeSelector from "../../components/productDetail/SizeSelector"
import QuantitySelector from "../../components/productDetail/QuantitySelector"
import ProductPersonalization from "../../components/productDetail/ProductPersonalization"
import RelatedProducts from "../../components/productDetail/RelatedProducts"
import { getCartByCustomerId, createCart, addItemToCart } from "../../api/cart"
import "./productDetail.css"

export default function ProductDetail() {
  const { id } = useParams()
  const { producto, productosRelacionados } = useLoaderData()
  const navigate = useNavigate()
  
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [personalizationMessage, setPersonalizationMessage] = useState("")
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const resolveImage = (relativePath) => {
    if (!relativePath) return null
    try {
      return new URL(`../../assets/${relativePath.split('/').pop()}`, import.meta.url).href
    } catch (_) {
      return relativePath
    }
  }

  // Si no hay producto, mostrar mensaje de error
  if (!producto) {
    return (
      <div className="product-detail-container">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Producto no encontrado</h2>
          <p>No se pudo cargar la información del producto. Por favor, verifica que el backend esté corriendo o intenta más tarde.</p>
          <a href="/productos" style={{ color: '#8B4513', textDecoration: 'underline' }}>Volver al catálogo</a>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Productos', path: '/productos' },
    { label: producto?.nombre || 'Detalle' }
  ]

  // Obtener tamaños disponibles del producto
  const availableSizes = producto?.tamanosDisponibles || []
  const isUnitProduct = availableSizes.length === 1 && availableSizes[0] === "unidad"

  const handleAddToCart = async () => {
    if (!isUnitProduct && !selectedSize) {
      alert('Por favor selecciona un tamaño')
      return
    }

    setIsAddingToCart(true)

    try {
      // Verificar si hay sesión iniciada
      const session = localStorage.getItem('sesionIniciada')
      
      if (!session) {
        alert('Por favor inicia sesión para agregar productos al carrito')
        navigate('/login')
        return
      }

      const user = JSON.parse(session)
      const customerId = user.customerId || user.id

      if (!customerId) {
        alert('Error: No se pudo obtener el ID del cliente')
        return
      }

      // Obtener o crear carrito
      let cart = await getCartByCustomerId(customerId)
      
      if (!cart || !cart.id_cart) {
        // Crear carrito si no existe
        await createCart(customerId)
        cart = await getCartByCustomerId(customerId)
      }

      const cartId = cart.id_cart || customerId

      // Preparar item para agregar (solo campos necesarios para el BFF)
      const sizeValue = isUnitProduct ? 'unidad' : selectedSize
      const item = {
        productCode: producto.code,
        quantity: quantity,
        size: sizeValue,
        personalizationMessage: personalizationMessage || null
      }

      // Agregar al carrito en el backend
      await addItemToCart(cartId, item)

      // Disparar evento para actualizar el contador del carrito
      window.dispatchEvent(new Event('cartUpdated'))

      // Mensaje de confirmación
      let mensaje = `¡Añadido al carrito! ${quantity} x ${producto?.nombre}${isUnitProduct ? '' : ` (${selectedSize})`}`
      if (personalizationMessage) {
        mensaje += `\nMensaje: "${personalizationMessage}"`
      }
      alert(mensaje)

      // Resetear formulario
      setSelectedSize("")
      setQuantity(1)
      setPersonalizationMessage("")

    } catch (error) {
      console.error('Error al agregar al carrito:', error)
      alert(`Error al agregar al carrito: ${error.message}`)
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (!producto) {
    return <div className="loading-container">Producto no encontrado</div>
  }

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="product-detail-container">
        <div className="product-detail-image">
          {producto.imagen && (
            <img
              src={resolveImage(producto.imagen)}
              alt={producto.nombre}
            />
          )}
        </div>

        <div className="product-detail-info">
          <h1 className="product-detail-title">{producto.nombre}</h1>
          <span className="product-detail-price">
            ${producto.precioCLP?.toLocaleString('es-CL')}
          </span>
          
          <div className="product-badges">
            <span className="product-stock-badge">En stock</span>
            {producto.personalizable && (
              <span className="product-personalizable-badge">Personalizable</span>
            )}
          </div>

          <p className="product-detail-description">{producto.descripcion}</p>

          <div className="product-options">
            {!isUnitProduct && (
              <SizeSelector
                sizes={availableSizes}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
              />
            )}

            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
            />

            {producto.personalizable && (
              <ProductPersonalization
                maxChars={producto.maxMsgChars || 50}
                onMessageChange={setPersonalizationMessage}
              />
            )}

            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>

      <RelatedProducts 
        productos={productosRelacionados}
        currentProductId={id}
      />
    </>
  )
}
