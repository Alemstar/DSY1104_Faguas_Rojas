# Especificaciones del Backend de Cart

## Puertos
- **DB**: 8180
- **BS**: 8181
- **BFF**: 8182

## Cambios Necesarios

### 1. Actualizar DTOs

#### CartDTO.java
```java
public class CartDTO {
    @JsonProperty("id_cart")
    private Long idCart;
    
    @JsonProperty("id_customer")
    private String idCustomer;  // Cambiar de Long a String para soportar IDs temporales
    
    @JsonProperty("items")  // Cambiar "Products" por "items"
    private List<CartItemDTO> items;
    
    @JsonProperty("total")
    private int total;
}
```

#### CartItemDTO.java (NUEVO)
```java
public class CartItemDTO {
    @JsonProperty("product_id")
    private Long productId;
    
    @JsonProperty("product_name")
    private String productName;
    
    @JsonProperty("price")
    private int price;
    
    @JsonProperty("quantity")
    private int quantity;
    
    @JsonProperty("size")
    private String size;  // Ej: "unidad", "pequeño", "mediano", "grande"
    
    @JsonProperty("personalization_message")
    private String personalizationMessage;  // Mensaje personalizado opcional
}
```

### 2. Actualizar Entity

#### Cart.java
```java
@Entity
@Table(name = "cart")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "id_cart")
    private Long idCart;
    
    @Column(name = "id_customer")
    private String idCustomer;  // String en vez de Long
    
    @Column(name = "product_id")
    private Long productId;
    
    @Column(name = "product_name")
    private String productName;
    
    @Column(name = "price")
    private int price;
    
    @Column(name = "quantity")
    private int quantity;
    
    @Column(name = "size")
    private String size;
    
    @Column(name = "personalization_message")
    private String personalizationMessage;
}
```

### 3. Endpoints Actualizados

#### CartController.java

```java
@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    // Obtener carrito por ID
    @GetMapping("/getCartById/{idCart}")
    public ResponseEntity<CartDTO> getCartById(@PathVariable Long idCart) {
        return ResponseEntity.ok(cartService.getCartById(idCart));
    }
    
    // Crear carrito nuevo
    @PostMapping("/insertCart/{idCustomer}")
    public ResponseEntity<CartDTO> insertCart(@PathVariable String idCustomer) {
        return ResponseEntity.ok(cartService.createCart(idCustomer));
    }
    
    // Agregar producto al carrito
    @PostMapping("/insertProduct/{idCart}")
    public ResponseEntity<CartDTO> insertProduct(
        @PathVariable Long idCart,
        @RequestBody CartItemDTO item
    ) {
        return ResponseEntity.ok(cartService.addProduct(idCart, item));
    }
    
    // Actualizar cantidad de un producto
    @PutMapping("/updateQuantity/{idCart}/{productId}")
    public ResponseEntity<CartDTO> updateQuantity(
        @PathVariable Long idCart,
        @PathVariable Long productId,
        @RequestBody Map<String, Integer> body
    ) {
        int quantity = body.get("quantity");
        return ResponseEntity.ok(cartService.updateQuantity(idCart, productId, quantity));
    }
    
    // Eliminar producto del carrito
    @DeleteMapping("/deleteProduct/{idCart}/{productId}")
    public ResponseEntity<CartDTO> deleteProduct(
        @PathVariable Long idCart,
        @PathVariable Long productId
    ) {
        return ResponseEntity.ok(cartService.deleteProduct(idCart, productId));
    }
}
```

### 4. Lógica de Negocio (CartService)

**Puntos clave:**
- Al crear un carrito, generar un `idCart` único y retornar el CartDTO completo
- Al agregar un producto:
  - Si ya existe (mismo productId + size + personalizationMessage): incrementar quantity
  - Si no existe: crear nuevo registro
- Calcular el total automáticamente: `sum(price * quantity)` de todos los items
- Al eliminar: remover el registro específico
- Al actualizar cantidad: modificar el campo quantity

### 5. Respuestas JSON

#### GET /api/cart/getCartById/1
```json
{
  "id_cart": 1,
  "id_customer": "GUEST_1733356800_abc123xyz",
  "items": [
    {
      "product_id": 1,
      "product_name": "Torta Cuadrada de Chocolate",
      "price": 15000,
      "quantity": 2,
      "size": "mediano",
      "personalization_message": "Feliz Cumpleaños"
    },
    {
      "product_id": 3,
      "product_name": "Cupcakes Vainilla",
      "price": 2500,
      "quantity": 6,
      "size": "unidad",
      "personalization_message": ""
    }
  ],
  "total": 45000
}
```

#### POST /api/cart/insertCart/GUEST_123
```json
{
  "id_cart": 2,
  "id_customer": "GUEST_123",
  "items": [],
  "total": 0
}
```

## Base de Datos

### Tabla: cart

```sql
CREATE TABLE cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_cart BIGINT NOT NULL,
    id_customer VARCHAR(255) NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    size VARCHAR(50),
    personalization_message TEXT,
    INDEX idx_cart (id_cart),
    INDEX idx_customer (id_customer)
);
```

## Notas Importantes

1. **idCustomer es String**: Para soportar usuarios guest con IDs temporales como "GUEST_1733356800_abc123xyz"

2. **Múltiples registros por carrito**: Un carrito puede tener varios productos (múltiples filas con el mismo id_cart)

3. **Identificación única de items**: La combinación de `id_cart + product_id + size + personalization_message` debe ser única

4. **Total calculado**: El backend debe calcular el total sumando `price * quantity` de todos los items del carrito

5. **CORS**: Asegúrate de agregar `@CrossOrigin` para permitir requests desde localhost:5173 y 5174

## Frontend

El frontend está configurado con un flag `USE_BACKEND = false` en `src/api/cart.js`.

**Para activar el backend:**
1. Implementa todos los cambios arriba
2. Asegúrate de que los 3 servicios estén corriendo (DB:8180, BS:8181, BFF:8182)
3. Cambia `USE_BACKEND = true` en `src/api/cart.js`
4. Reinicia el frontend

Mientras `USE_BACKEND = false`, el carrito funciona 100% con localStorage (modo offline).
