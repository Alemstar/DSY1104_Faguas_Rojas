/**
 * Script para cargar los productos locales a la base de datos a través del BFF
 * Uso: node scripts/loadProducts.js
 */

import products from '../database/products.js';

const BFF_URL = 'http://localhost:8282';

// Mapear productos locales al formato que espera el backend
function mapProductToDTO(product, index) {
  return {
    code: product.code || '',
    product_name: product.nombre,
    descripcion: product.descripcion || '',
    price: product.precioCLP,
    stock: product.stock,
    categoria_id: product.categoriaId || '',
    imagen: product.imagen || '',
    personalizable: product.personalizable === true,
    max_msg_chars: product.maxMsgChars || 0,
    tipo_forma: product.tipoForma || '',
    tamanos_disponibles: Array.isArray(product.tamanosDisponibles) 
      ? product.tamanosDisponibles.join(',') 
      : product.tamanosDisponibles || ''
  };
}

async function loadProducts() {
  console.log(`🚀 Iniciando carga de ${products.length} productos al BFF...`);
  
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const productDTO = mapProductToDTO(product, i);

    try {
      console.log(`\n📦 Cargando producto ${i + 1}/${products.length}: ${product.nombre}`);
      
      // Mostrar el primer producto como ejemplo
      if (i === 0) {
        console.log('📋 Ejemplo de datos enviados:', JSON.stringify(productDTO, null, 2));
      }
      
      const response = await fetch(`${BFF_URL}/api/products/insertProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(productDTO)
      });

      if (response.ok) {
        const result = await response.text();
        console.log(`✅ Éxito: ${result}`);
        successCount++;
      } else {
        const error = await response.text();
        console.error(`❌ Error ${response.status}: ${error}`);
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ Error al cargar ${product.nombre}:`, error.message);
      errorCount++;
    }

    // Pequeña pausa entre requests para no saturar el servidor
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Productos cargados exitosamente: ${successCount}`);
  console.log(`❌ Productos con error: ${errorCount}`);
  console.log('='.repeat(50));
}

// Ejecutar el script
loadProducts().catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});
