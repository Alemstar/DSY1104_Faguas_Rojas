import { getProductById, getProducts } from "../services/product"

export async function productDetailLoader({ params }) {
  try {
    const { code } = params
    const producto = await getProductById(code)
    const todosLosProductos = await getProducts()
    
    // Filtrar productos de la misma categoría
    const productosRelacionados = todosLosProductos
      .filter(p => p.categoriaId === producto?.categoriaId && p.code !== code)
      .slice(0, 4)
    
    return { producto, productosRelacionados }
  } catch (error) {
    console.error('Error al cargar detalle de producto:', error);
    return { producto: null, productosRelacionados: [] };
  }
}
