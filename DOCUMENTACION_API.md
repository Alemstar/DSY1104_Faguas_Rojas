# Documentación de APIs e Integración - Pastelería Mil Sabores

## Información General

### URLs Base de la API

#### Microservicios de Clientes
- **URL BFF (Backend For Frontend)**: http://localhost:8082
- **URL BS (Business Service)**: http://localhost:8081
- **URL DB (Database Service)**: http://localhost:8080

#### Microservicios de Productos
- **URL Products BFF**: http://localhost:8282
- **URL Products BS**: http://localhost:8281
- **URL Products DB**: http://localhost:8280

#### Frontend
- **URL Frontend**: http://localhost:5173

### URLs Swagger

#### Clientes
- **Swagger Customers BFF**: http://localhost:8082/swagger-ui.html
- **Swagger Customers BS**: http://localhost:8081/swagger-ui.html
- **Swagger Customers DB**: http://localhost:8080/swagger-ui.html
- **API Docs Customers BFF**: http://localhost:8082/v3/api-docs
- **API Docs Customers BS**: http://localhost:8081/v3/api-docs
- **API Docs Customers DB**: http://localhost:8080/v3/api-docs

#### Productos
- **Swagger Products BFF**: http://localhost:8282/swagger-ui.html
- **Swagger Products BS**: http://localhost:8281/swagger-ui.html
- **Swagger Products DB**: http://localhost:8280/swagger-ui.html
- **API Docs Products BFF**: http://localhost:8282/v3/api-docs
- **API Docs Products BS**: http://localhost:8281/v3/api-docs
- **API Docs Products DB**: http://localhost:8280/v3/api-docs

### Tecnologías Utilizadas

- **Backend Framework**: Spring Boot 3.5.0
- **Lenguaje**: Java 21
- **Base de Datos**: MySQL 8.0
- **Seguridad**: Spring Security 6.x con JWT
- **Comunicación**: OpenFeign
- **Documentación**: Springdoc OpenAPI 2.3.0
- **Frontend**: React 18 + Vite 5
- **Cliente HTTP Frontend**: Axios 1.6.0
- **Enrutamiento**: React Router DOM 6

### Repositorio del Proyecto

- **GitHub**: https://github.com/Alemstar/DSY1104_Faguas_Rojas
- **Branch**: conexion_backend

---

## Índice
1. [Arquitectura de Microservicios](#arquitectura-de-microservicios)
2. [Implementación de Swagger](#implementación-de-swagger)
3. [Endpoints de Autenticación](#endpoints-de-autenticación)
4. [Endpoints de Clientes](#endpoints-de-clientes)
5. [Endpoints de Productos](#endpoints-de-productos)
6. [Endpoints de Carrito](#endpoints-de-carrito)
7. [Integración con Frontend](#integración-con-frontend)

---

## Arquitectura de Microservicios

El sistema de Pastelería Mil Sabores está construido sobre una arquitectura de microservicios que incluye:

### Servicios Backend

#### Microservicios de Clientes
- **ms-customers-bff** (Puerto 8082): Backend For Frontend - Capa de orquestación y seguridad
- **ms-customers-bs** (Puerto 8081): Business Service - Lógica de negocio
- **ms-customers-db** (Puerto 8080): Database Service - Acceso a datos

#### Microservicios de Productos
- **ms-products-bff** (Puerto 8282): Backend For Frontend - Capa de orquestación
- **ms-products-bs** (Puerto 8281): Business Service - Lógica de negocio de productos
- **ms-products-db** (Puerto 8280): Database Service - Acceso a datos de productos

### Frontend
- **React + Vite** (Puerto 5173): Aplicación web SPA

### Tecnologías
- **Spring Boot 3.5.0** - Framework backend
- **Spring Security 6.x** - Autenticación y autorización
- **JWT** - Tokens de seguridad
- **MySQL** - Base de datos
- **OpenFeign** - Comunicación entre microservicios
- **Swagger/OpenAPI** - Documentación de APIs
- **Axios** - Cliente HTTP en frontend

---

## Implementación de Swagger

### Configuración en Spring Boot

#### 1. Dependencias Maven (pom.xml)

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```

#### 2. Configuración de Swagger

Cada microservicio tiene configurada la documentación Swagger:

**Acceso a Swagger UI:**
- **BFF**: http://localhost:8082/swagger-ui.html
- **BS**: http://localhost:8081/swagger-ui.html
- **DB**: http://localhost:8080/swagger-ui.html

#### 3. Anotaciones en Controladores

```java
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication endpoints for login, register and token refresh")
public class AuthController {

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticate user and return JWT tokens")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        // ...
    }
}
```

---

## Endpoints de Autenticación

### POST /api/auth/login

**Descripción:** Autentica un usuario y retorna tokens JWT.

**Método:** POST

**URL:** `http://localhost:8082/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Datos de Entrada:**
```json
{
  "email": "valentina@duocuc.cl",
  "password": "Prueba.123"
}
```

**Respuesta:** 200 (Éxito), 401 (Credenciales inválidas)

```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900000,
  "email": "valentina@duocuc.cl",
  "name": "Valentina",
  "lastName": "Gomez",
  "userId": 6,
  "roles": ["USER"]
}
```

**Autenticación:** No requerida

**Observaciones:** Retorna access token (15 min) y refresh token (7 días).

---

### POST /api/auth/register

**Descripción:** Registra un nuevo usuario en el sistema.

**Método:** POST

**URL:** `http://localhost:8082/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Datos de Entrada:**
```json
{
  "email": "nuevo@duocuc.cl",
  "password": "Password.123",
  "name": "Juan",
  "lastName": "Pérez",
  "birthDate": "1990-05-15",
  "age": 34,
  "promoCode": "PROMO2024"
}
```

**Respuesta:** 201 (Creado), 409 (Email ya existe), 400 (Datos inválidos)

```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900000,
  "email": "nuevo@duocuc.cl",
  "name": "Juan",
  "lastName": "Pérez",
  "userId": 7,
  "roles": ["USER"]
}
```

**Autenticación:** No requerida

**Observaciones:** La contraseña se encripta con BCrypt. El rol por defecto es USER.

---

### POST /api/auth/refresh

**Descripción:** Refresca el access token usando el refresh token.

**Método:** POST

**URL:** `http://localhost:8082/api/auth/refresh`

**Headers:**
```
Content-Type: application/json
```

**Datos de Entrada:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9..."
}
```

**Respuesta:** 200 (Éxito), 401 (Refresh token inválido o expirado)

```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900000,
  "email": "valentina@duocuc.cl",
  "name": "Valentina",
  "lastName": "Gomez",
  "userId": 6,
  "roles": ["USER"]
}
```

**Autenticación:** No requerida (usa refresh token)

**Observaciones:** Genera nuevos access token y refresh token.

---

## Endpoints de Clientes

### GET /api/customers/GetCustomerById/{id}

**Descripción:** Obtiene los datos de un cliente por su ID.

**Método:** GET

**URL:** `http://localhost:8082/api/customers/GetCustomerById/6`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta:** 200 (Éxito), 404 (Cliente no encontrado), 403 (Sin permisos)

```json
{
  "id_customer": 6,
  "nombre": "Valentina",
  "apellidos": "Gomez",
  "email": "valentina@duocuc.cl",
  "roles": ["USER"]
}
```

**Autenticación:** Sí (USER o ADMIN). Los usuarios solo pueden ver su propia información.

**Observaciones:** Los campos de contraseña no se retornan por seguridad.

---

### GET /api/customers/GetCustomerByEmail/{email}

**Descripción:** Obtiene los datos de un cliente por su email.

**Método:** GET

**URL:** `http://localhost:8082/api/customers/GetCustomerByEmail/valentina@duocuc.cl`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta:** 200 (Éxito), 404 (Cliente no encontrado), 403 (Sin permisos)

```json
{
  "id_customer": 6,
  "nombre": "Valentina",
  "apellidos": "Gomez",
  "email": "valentina@duocuc.cl",
  "roles": ["USER"]
}
```

**Autenticación:** Sí (USER o ADMIN). Los usuarios solo pueden ver su propia información.

---

### GET /api/customers

**Descripción:** Lista todos los clientes registrados.

**Método:** GET

**URL:** `http://localhost:8082/api/customers`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta:** 200 (Éxito), 403 (Sin permisos)

```json
[
  {
    "id_customer": 1,
    "nombre": "María",
    "apellidos": "González",
    "email": "maria@duocuc.cl",
    "roles": ["USER"]
  },
  {
    "id_customer": 6,
    "nombre": "Valentina",
    "apellidos": "Gomez",
    "email": "valentina@duocuc.cl",
    "roles": ["USER"]
  }
]
```

**Autenticación:** Sí (Solo ADMIN)

**Observaciones:** Endpoint restringido a administradores.

---

### PUT /api/customers/UpdateCustomer

**Descripción:** Actualiza los datos de un cliente.

**Método:** PUT

**URL:** `http://localhost:8082/api/customers/UpdateCustomer`

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Datos de Entrada:**
```json
{
  "id_customer": 6,
  "nombre": "Valentina",
  "apellidos": "Gomez Silva",
  "email": "valentina@duocuc.cl",
  "password": "NuevaPassword.123"
}
```

**Respuesta:** 200 (Actualizado), 404 (Cliente no encontrado), 409 (Email duplicado), 403 (Sin permisos)

**Autenticación:** Sí (USER o ADMIN). Los usuarios solo pueden actualizar su propia información.

---

### DELETE /api/customers/DeleteCustomerById/{id}

**Descripción:** Elimina un cliente del sistema.

**Método:** DELETE

**URL:** `http://localhost:8082/api/customers/DeleteCustomerById/6`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta:** 200 (Eliminado), 404 (Cliente no encontrado), 403 (Sin permisos)

**Autenticación:** Sí (Solo ADMIN)

**Observaciones:** Operación irreversible, solo administradores.

---

## Endpoints de Productos

### GET /api/products

**Descripción:** Lista todos los productos disponibles en el catálogo.

**Método:** GET

**URL:** `http://localhost:8282/api/products`

**Headers:**
```
Content-Type: application/json
```

**Respuesta:** 200 (Éxito), 500 (Error del servidor)

```json
[
  {
    "code": "TORTA-CHOC-001",
    "nombre": "Torta de Chocolate Premium",
    "descripcion": "Deliciosa torta de chocolate con cobertura de ganache",
    "precio": 25000,
    "stock": 10,
    "categoria": "Tortas",
    "imagen": "/images/torta-chocolate.jpg",
    "personalizable": true,
    "maxMsgChars": 50,
    "tipoForma": "Redonda",
    "tamanosDisponibles": "Pequeño,Mediano,Grande"
  },
  {
    "code": "CHEESE-FRUT-002",
    "nombre": "Cheesecake de Frutilla",
    "descripcion": "Suave cheesecake con salsa de frutillas frescas",
    "precio": 18000,
    "stock": 15,
    "categoria": "Cheesecake",
    "imagen": "/images/cheesecake-frutilla.jpg",
    "personalizable": false,
    "maxMsgChars": 0,
    "tipoForma": "Redonda",
    "tamanosDisponibles": "Mediano,Grande"
  }
]
```

**Autenticación:** No requerida

**Observaciones:** Endpoint público para mostrar el catálogo completo de productos.

---

### GET /api/products/GetProductByCode/{code}

**Descripción:** Obtiene los detalles de un producto específico por su código.

**Método:** GET

**URL:** `http://localhost:8282/api/products/GetProductByCode/TORTA-CHOC-001`

**Headers:**
```
Content-Type: application/json
```

**Respuesta:** 200 (Éxito), 404 (Producto no encontrado)

```json
{
  "code": "TORTA-CHOC-001",
  "nombre": "Torta de Chocolate Premium",
  "descripcion": "Deliciosa torta de chocolate con cobertura de ganache. Triple capa de bizcocho de chocolate rellena con mousse de chocolate belga y cubierta con ganache oscuro. Decorada con virutas de chocolate y fresas frescas.",
  "precio": 25000,
  "stock": 10,
  "categoria": "Tortas",
  "imagen": "/images/torta-chocolate.jpg",
  "personalizable": true,
  "maxMsgChars": 50,
  "tipoForma": "Redonda",
  "tamanosDisponibles": "Pequeño,Mediano,Grande"
}
```

**Autenticación:** No requerida

**Observaciones:** Útil para mostrar detalles completos del producto en páginas de detalle.

---

### POST /api/products/insertProduct

**Descripción:** Crea un nuevo producto en el catálogo.

**Método:** POST

**URL:** `http://localhost:8282/api/products/insertProduct`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {accessToken}
```

**Datos de Entrada:**
```json
{
  "code": "BROWNIE-NUT-003",
  "nombre": "Brownie con Nueces",
  "descripcion": "Brownie casero con trozos de nueces caramelizadas",
  "precio": 8000,
  "stock": 25,
  "categoria": "Brownies",
  "imagen": "/images/brownie-nueces.jpg",
  "personalizable": false,
  "maxMsgChars": 0,
  "tipoForma": "Cuadrado",
  "tamanosDisponibles": "Pequeño,Mediano"
}
```

**Respuesta:** 200 (Creado), 400 (Datos inválidos), 409 (Código ya existe)

```
"Producto creado exitosamente"
```

**Autenticación:** Sí (Solo ADMIN)

**Observaciones:** El código del producto debe ser único. Solo administradores pueden crear productos.

---

### PUT /api/products/UpdateProduct

**Descripción:** Actualiza los datos de un producto existente.

**Método:** PUT

**URL:** `http://localhost:8282/api/products/UpdateProduct`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {accessToken}
```

**Datos de Entrada:**
```json
{
  "code": "TORTA-CHOC-001",
  "nombre": "Torta de Chocolate Premium ACTUALIZADA",
  "descripcion": "Descripción actualizada del producto",
  "precio": 27000,
  "stock": 8,
  "categoria": "Tortas",
  "imagen": "/images/torta-chocolate-new.jpg",
  "personalizable": true,
  "maxMsgChars": 60,
  "tipoForma": "Redonda",
  "tamanosDisponibles": "Pequeño,Mediano,Grande,Extra Grande"
}
```

**Respuesta:** 200 (Actualizado), 404 (Producto no encontrado), 400 (Datos inválidos)

```
"Producto actualizado exitosamente"
```

**Autenticación:** Sí (Solo ADMIN)

**Observaciones:** El código del producto no se puede modificar, sirve como identificador único.

---

### DELETE /api/products/DeleteProductByCode/{code}

**Descripción:** Elimina un producto del catálogo.

**Método:** DELETE

**URL:** `http://localhost:8282/api/products/DeleteProductByCode/BROWNIE-NUT-003`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta:** 200 (Eliminado), 404 (Producto no encontrado)

```
"Producto eliminado exitosamente"
```

**Autenticación:** Sí (Solo ADMIN)

**Observaciones:** Operación irreversible. Solo administradores pueden eliminar productos del catálogo

---

## Endpoints de Carrito

### GET /api/cart

**Descripción:** Obtiene el carrito de compras del usuario autenticado.

**Método:** GET

**URL:** `http://localhost:8082/api/cart`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta:** 200 (Éxito), 401 (No autenticado)

```json
{
  "items": [
    {
      "productId": 1,
      "productName": "Torta de Chocolate",
      "quantity": 2,
      "price": 25000,
      "subtotal": 50000
    }
  ],
  "total": 50000,
  "discount": 0,
  "finalTotal": 50000
}
```

**Autenticación:** Sí (USER o ADMIN)

---

### POST /api/cart/add

**Descripción:** Agrega un producto al carrito.

**Método:** POST

**URL:** `http://localhost:8082/api/cart/add`

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Datos de Entrada:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Respuesta:** 201 (Agregado), 400 (Datos inválidos), 404 (Producto no encontrado)

**Autenticación:** Sí (USER o ADMIN)

---

### DELETE /api/cart/remove/{productId}

**Descripción:** Elimina un producto del carrito.

**Método:** DELETE

**URL:** `http://localhost:8082/api/cart/remove/1`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta:** 200 (Eliminado), 404 (Producto no encontrado en carrito)

**Autenticación:** Sí (USER o ADMIN)

---

## Integración con Frontend

### Configuración de Axios

El frontend utiliza Axios para comunicarse con el backend. La configuración se encuentra en `src/config/axios.config.js`:

```javascript
import axios from 'axios';

// Configuración base para API de clientes
export const customersApi = axios.create({
  baseURL: 'http://localhost:8082',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para agregar token JWT automáticamente
customersApi.interceptors.request.use(
  (config) => {
    // No agregar token a rutas públicas
    const publicRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh'];
    const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));
    
    if (!isPublicRoute) {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar refresh token automático
customersApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await customersApi.post('/api/auth/refresh', {
            refreshToken
          });
          
          const { accessToken } = response.data;
          localStorage.setItem('access_token', accessToken);
          
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return customersApi(originalRequest);
        } catch (refreshError) {
          // Refresh falló, redirigir a login
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);
```

### Servicios de Autenticación

Los servicios de autenticación encapsulan las llamadas a la API (`src/services/auth/index.js`):

```javascript
import { customersApi } from '../../config/axios.config';
import { ENDPOINTS, STORAGE_KEYS } from '../../config/api.config';

export const login = async (credentials) => {
  try {
    const response = await customersApi.post(ENDPOINTS.AUTH_LOGIN, credentials);
    
    const { 
      accessToken, 
      refreshToken, 
      name, 
      lastName, 
      userId, 
      email, 
      roles 
    } = response.data;

    // Guardar tokens
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    
    // Guardar datos del usuario
    const userData = {
      nombre: name || '',
      apellidos: lastName || '',
      email: email,
      userId: userId,
      roles: roles || []
    };
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    
    // Notificar cambios
    window.dispatchEvent(new Event('storage'));
    
    return response.data;
  } catch (error) {
    throw new Error('Credenciales inválidas');
  }
};

export const register = async (userData) => {
  try {
    const response = await customersApi.post(ENDPOINTS.AUTH_REGISTER, userData);
    
    // Guardar tokens automáticamente después del registro
    const { accessToken, refreshToken, name, lastName, userId, email, roles } = response.data;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    
    const userDataToSave = {
      nombre: name || '',
      apellidos: lastName || '',
      email: email,
      userId: userId,
      roles: roles || []
    };
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userDataToSave));
    
    window.dispatchEvent(new Event('storage'));
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error('El email ya está registrado');
    }
    throw new Error('Error al registrar usuario');
  }
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  window.dispatchEvent(new Event('storage'));
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  return userData ? JSON.parse(userData) : null;
};
```

### Uso en Componentes React

Ejemplo de componente de login (`src/pages/auth/Login.jsx`):

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/auth';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(credentials);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        placeholder="Contraseña"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
```

### Hook Personalizado useAuth

Para facilitar el manejo de autenticación (`src/hooks/useAuth.js`):

```javascript
import { useState, useEffect } from 'react';
import { getCurrentUser, logout as logoutService } from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getCurrentUser();
    setUser(userData);
    setLoading(false);

    const handleStorageChange = () => {
      const updatedUser = getCurrentUser();
      setUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.roles?.includes('ADMIN'),
    logout
  };
};
```

### Ejemplo de Uso del Hook

```javascript
import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function SessionLinks() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <>
        <a href="/login">Iniciar Sesión</a>
        <a href="/register">Registrarse</a>
      </>
    );
  }

  return (
    <>
      <span>Hola, {user.nombre} {user.apellidos}</span>
      <a href="/profile">Ver Perfil</a>
      <button onClick={logout}>Cerrar Sesión</button>
    </>
  );
}
```

---

## Manejo de Errores

### Códigos de Estado HTTP

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Datos de entrada inválidos
- **401 Unauthorized**: No autenticado o token inválido
- **403 Forbidden**: Sin permisos para acceder al recurso
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Conflicto (ej: email duplicado)
- **500 Internal Server Error**: Error del servidor

### Manejo en Frontend

```javascript
try {
  const response = await customersApi.get('/api/customers/6');
  // Procesar respuesta exitosa
} catch (error) {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // Redirigir a login
        navigate('/login');
        break;
      case 403:
        // Mostrar mensaje de permisos insuficientes
        setError('No tienes permisos para realizar esta acción');
        break;
      case 404:
        // Recurso no encontrado
        setError('Cliente no encontrado');
        break;
      default:
        setError('Error al procesar la solicitud');
    }
  } else if (error.request) {
    // Error de red
    setError('No se pudo conectar con el servidor');
  } else {
    // Error al configurar la petición
    setError('Error inesperado');
  }
}
```

---

## Seguridad

### CORS

Configuración en Spring Boot para permitir peticiones desde el frontend:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### JWT Tokens

- **Access Token**: Válido por 15 minutos
- **Refresh Token**: Válido por 7 días
- **Algoritmo**: HS512
- **Claim userId**: ID del cliente en la base de datos
- **Claim roles**: Roles del usuario (USER, ADMIN)

### Protección de Rutas

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
            .anyRequest().authenticated()
        )
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    
    return http.build();
}
```

---

## Buenas Prácticas

### Backend

1. **Validación de Datos**: Usar `@Valid` en DTOs con Bean Validation
2. **Manejo de Excepciones**: Usar `@ControllerAdvice` para manejo centralizado
3. **Logging**: Usar SLF4J para registrar operaciones importantes
4. **DTOs**: No exponer entidades JPA directamente
5. **Seguridad**: No retornar contraseñas en respuestas
6. **Documentación**: Mantener Swagger actualizado

### Frontend

1. **Interceptores**: Manejar tokens y errores centralizadamente
2. **LocalStorage**: Solo guardar datos no sensibles (nunca contraseñas)
3. **Validación**: Validar datos antes de enviar al backend
4. **Loading States**: Mostrar indicadores de carga
5. **Error Handling**: Mostrar mensajes claros al usuario
6. **Logout**: Limpiar todo el estado al cerrar sesión

---

## Testing con Swagger

### Flujo de Testing Completo

1. **Registrar Usuario**
   - Ir a http://localhost:8082/swagger-ui.html
   - Endpoint: `POST /api/auth/register`
   - Ejecutar con datos de prueba
   - Copiar el `accessToken` de la respuesta

2. **Autenticar Peticiones**
   - Hacer clic en "Authorize" en Swagger UI
   - Ingresar: `Bearer {accessToken}`
   - Confirmar

3. **Probar Endpoints Protegidos**
   - `GET /api/customers/GetCustomerById/{id}`
   - Usar el userId obtenido en el registro
   - Verificar que retorna los datos correctos

4. **Refrescar Token**
   - `POST /api/auth/refresh`
   - Usar el `refreshToken` obtenido anteriormente
   - Obtener nuevo `accessToken`

---

## Troubleshooting

### Error: CORS

**Problema**: Error de CORS en el navegador  
**Solución**: Verificar que el origen está permitido en `corsConfigurationSource()`

### Error: 401 Unauthorized

**Problema**: Token no se envía correctamente  
**Solución**: Verificar que el interceptor de Axios esté configurado y el token exista en localStorage

### Error: 403 Forbidden

**Problema**: Usuario sin permisos  
**Solución**: Verificar roles del usuario y configuración de `@PreAuthorize`

### Error: Network Error

**Problema**: No se puede conectar al backend  
**Solución**: Verificar que los microservicios estén corriendo en los puertos correctos

---

## Conclusión

Esta documentación cubre la integración completa entre el frontend React y los microservicios backend de Pastelería Mil Sabores. La arquitectura implementa:

- ✅ Autenticación JWT segura
- ✅ Refresh token automático
- ✅ Documentación Swagger interactiva
- ✅ Interceptores Axios para manejo de tokens
- ✅ Manejo centralizado de errores
- ✅ Protección de rutas con Spring Security
- ✅ CORS configurado correctamente
- ✅ Separación de responsabilidades (BFF/BS/DB)

Para más información, consultar la documentación técnica individual de cada microservicio o contactar al equipo de desarrollo.
