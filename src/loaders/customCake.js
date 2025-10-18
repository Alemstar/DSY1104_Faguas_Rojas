export async function customCakeLoader() {
  // Opciones de personalización hardcodeadas
  const options = {
    sizes: [
      { id: 's6', label: '6 porciones', portions: 6, priceMultiplier: 1 },
      { id: 'm12', label: '12 porciones', portions: 12, priceMultiplier: 1.5 },
      { id: 'l20', label: '20 porciones', portions: 20, priceMultiplier: 2 },
      { id: 'xl30', label: '30 porciones', portions: 30, priceMultiplier: 2.5 }
    ],
    shapes: [
      { id: 'circular', label: 'Circular' },
      { id: 'cuadrada', label: 'Cuadrada' }
    ],
    flavors: [
      'Vainilla',
      'Chocolate',
      'Manjar',
      'Frutilla',
      'Naranja',
      'Limón'
    ],
    fillings: [
      { id: 'manjar', label: 'Manjar', price: 2000 },
      { id: 'nutella', label: 'Nutella', price: 2500 },
      { id: 'crema', label: 'Crema', price: 1500 }
    ],
    pricing: {
      basePrice: 8000,
      maxMessageChars: 60
    }
  }

  return options
}
