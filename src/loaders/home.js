import { getProducts } from '../services/product';

export async function homeLoader() {
  try {
    const products = await getProducts();
    return {
      message: "Ganadores del record Guinness en 1995 a la torta mas grande del mundo.",
      products
    };
  } catch (error) {
    console.error('Error al cargar productos en home:', error);
    // Retornar datos vacíos si el backend no está disponible
    return {
      message: "Ganadores del record Guinness en 1995 a la torta mas grande del mundo.",
      products: []
    };
  }
}