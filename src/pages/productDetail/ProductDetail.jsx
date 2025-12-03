import { useParams, useLoaderData } from "react-router-dom"
import { useState } from "react"
import Breadcrumb from "../../components/productDetail/Breadcrumb"
import SizeSelector from "../../components/productDetail/SizeSelector"
import QuantitySelector from "../../components/productDetail/QuantitySelector"
import ProductPersonalization from "../../components/productDetail/ProductPersonalization"
import RelatedProducts from "../../components/productDetail/RelatedProducts"
import "./productDetail.css"

export default function ProductDetail() {
  const { id } = useParams()
  const { producto, productosRelacionados } = useLoaderData()
  
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [personalizationMessage, setPersonalizationMessage] = useState("")

  const resolveImage = (relativePath) => {
    if (!relativePath) return null
    try {
      return new URL(`../../assets/${relativePath.split('/').pop()}`, import.meta.url).href
    } catch (_) {
      return relativePath
    }
  }

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Productos', path: '/productos' },
    { label: producto?.nombre || 'Detalle' }
  ]

  // Obtener tamaños disponibles del producto
  const availableSizes = producto?.tamanosDisponibles || []
  const isUnitProduct = availableSizes.length === 1 && availableSizes[0] === "unidad"

  const handleAddToCart = () => {
    if (!isUnitProduct && !selectedSize) {
      alert('Por favor selecciona un tamaño')
      return
    }

    // Obtener carrito actual del localStorage
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]')
    
    const sizeValue = isUnitProduct ? 'unidad' : selectedSize
    const messageValue = personalizationMessage || ''
    
    // Buscar si ya existe un item con las mismas características
    const existingItemIndex = currentCart.findIndex(item => 
      item.producto.id === producto.id &&
      item.size === sizeValue &&
      item.personalizationMessage === messageValue
    )
    
    let updatedCart
    
    if (existingItemIndex !== -1) {
      // Si existe, incrementar la cantidad
      updatedCart = [...currentCart]
      updatedCart[existingItemIndex].quantity += quantity
      console.log('Incrementando cantidad del item existente:', updatedCart[existingItemIndex])
    } else {
      // Si no existe, crear nuevo item
      const newItem = {
        id: `${producto.code}-${sizeValue}-${Date.now()}`,
        producto: producto,
        size: sizeValue,
        quantity: quantity,
        personalizationMessage: messageValue
      }
      updatedCart = [...currentCart, newItem]
      console.log('Añadiendo nuevo item al carrito:', newItem)
    }
    
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    console.log('Carrito actualizado:', updatedCart)
    
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
