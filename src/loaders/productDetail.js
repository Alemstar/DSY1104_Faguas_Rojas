import { getProductById, getProducts } from "../api/products.js"

export async function productDetailLoader({ params }) {
  const { id } = params
  const producto = await getProductById(id)
  const todosLosProductos = await getProducts()
  
  // Filtrar productos de la misma categoría
  const productosRelacionados = todosLosProductos
    .filter(p => p.categoriaId === producto?.categoriaId && p.id !== id)
    .slice(0, 4)
  
  return { producto, productosRelacionados }
}
