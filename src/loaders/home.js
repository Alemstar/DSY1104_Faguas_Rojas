import { getProducts } from '../services/product';

export async function homeLoader() {
  const products = await getProducts();
  return {
    message: "Ganadores del record Guinness en 1995 a la torta mas grande del mundo.",
    products
  }
}