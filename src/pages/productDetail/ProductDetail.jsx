import { useParams, useLoaderData } from "react-router-dom"
import { useState } from "react"
import Breadcrumb from "../../components/productDetail/Breadcrumb"
import SizeSelector from "../../components/productDetail/SizeSelector"
import QuantitySelector from "../../components/productDetail/QuantitySelector"
import ProductPersonalization from "../../components/productDetail/ProductPersonalization"
import RelatedProducts from "../../components/productDetail/RelatedProducts"
import "./productDetail.css"

export default function ProductDetail() {
  const { code } = useParams()
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
    // Aquí agregarías la lógica para añadir al carrito
    const sizeInfo = isUnitProduct ? 'unidad' : selectedSize
    console.log('Añadir al carrito:', {
      producto: producto?.nombre,
      tamaño: sizeInfo,
      cantidad: quantity,
      mensaje: personalizationMessage || 'Sin mensaje'
    })
    
    let mensaje = `Añadido al carrito: ${quantity} x ${producto?.nombre}${isUnitProduct ? '' : ` (${selectedSize})`}`
    if (personalizationMessage) {
      mensaje += `\nMensaje: "${personalizationMessage}"`
    }
    alert(mensaje)
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
        currentProductCode={code}
      />
    </>
  )
}
