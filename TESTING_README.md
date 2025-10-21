# Pruebas de Componentes con Jest y React Testing Library

Este proyecto incluye **87 pruebas** para **10 componentes críticos** de la aplicación.

## 📋 Componentes Probados

### 1. **LoginForm** (8 pruebas)
- ✅ Renderizado de todos los campos (email, password, botón)
- ✅ Actualización de estado al escribir en inputs
- ✅ Envío del formulario
- ✅ Estado de carga (botón deshabilitado y texto "Verificando...")
- ✅ Mostrar mensajes de feedback
- ✅ Validación de campos requeridos
- ✅ Validación de longitud de password (min: 4, max: 10)

### 2. **RegisterForm** (8 pruebas)
- ✅ Renderizado de todos los campos del formulario
- ✅ Llamada a función updateField al escribir
- ✅ Botón de registro funcional
- ✅ Envío del formulario
- ✅ Mostrar mensajes de feedback
- ✅ Campo código promo como opcional
- ✅ Validación de password con límites
- ✅ Título personalizado

### 3. **ContactForm** (8 pruebas)
- ✅ Renderizado completo del formulario
- ✅ Actualización de campos (nombre, email, mensaje)
- ✅ Validación de campos requeridos
- ✅ Envío del formulario con datos completos
- ✅ Limpieza del formulario después del envío
- ✅ Validación HTML5

### 4. **ProductCard** (8 pruebas)
- ✅ Renderizado de detalles del producto
- ✅ Renderizado de imagen del producto
- ✅ Formato correcto del precio (CLP)
- ✅ Función onAdd al hacer clic en "Añadir"
- ✅ Botón deshabilitado cuando stock = 0
- ✅ Manejo de productos sin imagen
- ✅ Modo preview sin callback onAdd
- ✅ Clases CSS correctas

### 5. **CartItem** (10 pruebas)
- ✅ Renderizado completo del item
- ✅ Cálculo correcto del precio total
- ✅ Incrementar cantidad (+)
- ✅ Decrementar cantidad (-)
- ✅ Botón - deshabilitado cuando cantidad = 1
- ✅ Eliminar item del carrito
- ✅ Mostrar detalles de personalización
- ✅ Mostrar mensaje personalizado
- ✅ No mostrar tamaño cuando es "unidad"

### 6. **QuantitySelector** (10 pruebas)
- ✅ Renderizado con valor inicial
- ✅ Incrementar cantidad
- ✅ Decrementar cantidad
- ✅ Botón - deshabilitado en mínimo
- ✅ Botón + deshabilitado en máximo
- ✅ Actualización mediante input directo
- ✅ Manejo de input vacío
- ✅ Respeto de límites personalizados (min/max)
- ✅ Validación de rango
- ✅ Valores por defecto (min=1, max=99)

### 7. **SearchBar** (10 pruebas)
- ✅ Renderizado del input de búsqueda
- ✅ Filtrado por nombre de producto
- ✅ Filtrado por código de producto
- ✅ Búsqueda case-insensitive
- ✅ Retornar todos los productos cuando está vacío
- ✅ Array vacío cuando no hay coincidencias
- ✅ Actualización del valor del input
- ✅ Manejo de productos con datos incompletos
- ✅ Ignorar espacios en blanco

### 8. **EmptyCart** (5 pruebas)
- ✅ Renderizado del mensaje "carrito vacío"
- ✅ Clases CSS correctas
- ✅ Componente simple sin interacciones

### 9. **CouponInput** (10 pruebas)
- ✅ Renderizado del input y botón
- ✅ Actualización del valor al escribir
- ✅ Aplicar cupón con clic en botón
- ✅ Aplicar cupón con tecla Enter
- ✅ Eliminar espacios en blanco
- ✅ No aplicar cupón vacío
- ✅ No aplicar solo espacios
- ✅ Convertir código a mayúsculas
- ✅ Validación de ID y type correctos

### 10. **CartSummary** (12 pruebas)
- ✅ Renderizado del resumen con total
- ✅ Mostrar todos los beneficios disponibles
- ✅ Renderizado del componente CouponInput
- ✅ Mostrar información de cupón aplicado
- ✅ Llamar a onClearCart
- ✅ Llamar a onCheckout
- ✅ Botones deshabilitados cuando carrito vacío
- ✅ Formato de precios en CLP
- ✅ Propagación de onApplyCoupon
- ✅ Contar 3 beneficios en la lista
- ✅ Renderizado del título de beneficios
- ✅ No mostrar cupón cuando no existe

## 🚀 Ejecutar las Pruebas

### Ejecutar todas las pruebas
```bash
npm test
```

### Ejecutar pruebas en modo watch (desarrollo)
```bash
npm run test:watch
```

### Ejecutar pruebas sin reporte de cobertura
```bash
npm test -- --no-coverage
```

### Ejecutar pruebas de un componente específico
```bash
npm test LoginForm
npm test CartItem
```

## 📊 Reporte de Cobertura

El proyecto está configurado con umbrales de cobertura del **80%** en:
- ✅ Ramas (branches)
- ✅ Funciones (functions)
- ✅ Líneas (lines)
- ✅ Declaraciones (statements)

Los reportes se generan en la carpeta `coverage/` en formato:
- **HTML** - Navegable en el navegador (`coverage/lcov-report/index.html`)
- **LCOV** - Para integraciones con herramientas CI/CD
- **Text** - Resumen en consola

## 🛠️ Tecnologías Utilizadas

- **Jest** - Framework de testing
- **@testing-library/react** - Utilidades para probar componentes React
- **@testing-library/jest-dom** - Matchers personalizados para el DOM
- **babel-jest** - Transformación de código con Babel
- **babel-plugin-transform-vite-meta-env** - Soporte para import.meta de Vite

## 📝 Qué se Prueba en los Componentes

### 1. **Renderizado**
- Que todos los elementos aparezcan correctamente
- Que las clases CSS sean las esperadas
- Que el contenido se muestre según las props

### 2. **Interacciones del Usuario**
- Clics en botones
- Cambios en inputs
- Envío de formularios
- Teclas especiales (Enter)

### 3. **Lógica de Negocio**
- Cálculos (precios, totales)
- Validaciones (campos requeridos, límites)
- Transformaciones (mayúsculas, formatos)
- Filtros y búsquedas

### 4. **Manejo de Estado**
- Llamadas a funciones callback
- Actualización de valores
- Estados condicionales (loading, disabled)

### 5. **Casos Extremos**
- Datos vacíos o null
- Valores mínimos y máximos
- Productos sin stock
- Carritos vacíos

## 🎯 Mejores Prácticas Implementadas

1. **Mocks apropiados**: Se usan mocks para componentes con `import.meta.url`
2. **Queries semánticas**: Se priorizan queries por rol y texto visible
3. **Assertions claras**: Cada test valida un único comportamiento
4. **Cleanup automático**: React Testing Library limpia el DOM automáticamente
5. **Nombres descriptivos**: Los tests describen claramente qué validan
6. **Aislamiento**: Cada test es independiente y no afecta a otros

## 🔍 Cómo Interpretar los Resultados

```
Test Suites: 10 passed, 10 total
Tests:       87 passed, 87 total
```

- **Test Suites**: Archivos de prueba (10 componentes)
- **Tests**: Casos de prueba individuales (87 pruebas)
- **Snapshots**: No se usan en este proyecto
- **Time**: Tiempo total de ejecución

## 📚 Recursos Adicionales

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Nota**: Todas las pruebas están pasando exitosamente ✅
