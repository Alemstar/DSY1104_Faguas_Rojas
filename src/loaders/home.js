import { getProducts } from '../api/products.js';

export async function homeLoader() {
  try {
    const products = await getProducts();
    return {
      message: "Ganadores del record Guinness en 1995 a la torta mas grande del mundo.",
      products
    }
  } catch (error) {
    console.error('Error cargando productos:', error);
    return {
      message: "Ganadores del record Guinness en 1995 a la torta mas grande del mundo.",
      products: []
    }
  }
}