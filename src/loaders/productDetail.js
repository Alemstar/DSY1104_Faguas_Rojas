import { getProductById, getProducts } from "../services/product"

export async function productDetailLoader({ params }) {
  const { code } = params
  const producto = await getProductById(code)
  const todosLosProductos = await getProducts()
  
  // Filtrar productos de la misma categoría
  const productosRelacionados = todosLosProductos
    .filter(p => p.categoriaId === producto?.categoriaId && p.code !== code)
    .slice(0, 4)
  
  return { producto, productosRelacionados }
}
