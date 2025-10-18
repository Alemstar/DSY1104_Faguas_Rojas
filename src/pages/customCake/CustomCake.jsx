import { useState, useEffect } from "react"
import { useLoaderData } from "react-router-dom"
import CakeCustomizer from "../../components/customCake/CakeCustomizer"
import CakePreview from "../../components/customCake/CakePreview"
import "./customCake.css"

export default function CustomCake() {
  const options = useLoaderData()

  const [selections, setSelections] = useState({
    size: null,
    shape: 'circular',
    flavor: '',
    fillings: [],
    message: ''
  })

  const [estimatedPrice, setEstimatedPrice] = useState(0)

  // Calcular precio estimado
  const calculatePrice = () => {
    let price = options.pricing.basePrice

    // Agregar multiplicador por tamaño
    if (selections.size) {
      price *= selections.size.priceMultiplier
    }

    // Agregar precio de rellenos
    selections.fillings.forEach(fillingId => {
      const filling = options.fillings.find(f => f.id === fillingId)
      if (filling) {
        price += filling.price
      }
    })

    return Math.round(price)
  }

  // Actualizar precio cuando cambian las selecciones
  useEffect(() => {
    setEstimatedPrice(calculatePrice())
  }, [selections])

  const handleSelectionChange = (field, value) => {
    setSelections(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleUpdatePreview = () => {
    // Recalcular precio (ya se hace automáticamente con useEffect)
    console.log('Vista previa actualizada:', selections)
  }

  const handleAddToCart = () => {
    // Validaciones
    if (!selections.size) {
      alert('Por favor selecciona un tamaño')
      return
    }

    if (!selections.flavor) {
      alert('Por favor selecciona un sabor')
      return
    }

    // Crear item personalizado para el carrito
    const customCake = {
      id: `custom-cake-${Date.now()}`,
      producto: {
        code: 'CUSTOM',
        nombre: 'Torta Personalizada',
        categoriaId: 'CUSTOM',
        precioCLP: estimatedPrice,
        personalizable: true,
        imagen: 'assets/Torta Especial de Cumpleaños.jpg' // imagen por defecto
      },
      size: selections.size.label,
      quantity: 1,
      personalizationMessage: selections.message,
      customDetails: {
        shape: selections.shape,
        flavor: selections.flavor,
        fillings: selections.fillings.map(fId => {
          const filling = options.fillings.find(f => f.id === fId)
          return filling?.label
        })
      }
    }

    // Agregar al carrito
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const updatedCart = [...currentCart, customCake]
    localStorage.setItem('cart', JSON.stringify(updatedCart))

    // Disparar evento
    window.dispatchEvent(new Event('cartUpdated'))

    alert('¡Torta personalizada añadida al carrito!')

    // Resetear formulario
    setSelections({
      size: null,
      shape: 'circular',
      flavor: '',
      fillings: [],
      message: ''
    })
  }

  // Preparar datos para el preview
  const previewData = {
    size: selections.size,
    shape: selections.shape,
    flavor: selections.flavor,
    fillings: selections.fillings.map(fId => {
      const filling = options.fillings.find(f => f.id === fId)
      return filling?.label
    }),
    message: selections.message
  }

  return (
    <div className="custom-cake-page">
      <h1 className="page-title">Personaliza tu torta</h1>

      <div className="custom-cake-container">
        <CakeCustomizer
          options={options}
          selections={selections}
          onSelectionChange={handleSelectionChange}
          onUpdatePreview={handleUpdatePreview}
          onAddToCart={handleAddToCart}
        />

        <CakePreview
          selections={previewData}
          estimatedPrice={estimatedPrice}
        />
      </div>
    </div>
  )
}
