import { useState } from 'react';
import { getProducts } from '../services/product';
import { login } from '../services/auth';
import { API_CONFIG } from '../config/api.config';

/**
 * Componente para probar la conexión con los microservicios backend
 * Este componente es solo para testing y debe eliminarse en producción
 */
export default function TestConnection() {
  const [results, setResults] = useState({
    products: null,
    auth: null,
    cart: null,
  });
  const [loading, setLoading] = useState({
    products: false,
    auth: false,
    cart: false,
  });

  // Probar conexión con Products BFF
  const testProducts = async () => {
    setLoading(prev => ({ ...prev, products: true }));
    try {
      const data = await getProducts();
      setResults(prev => ({
        ...prev,
        products: { success: true, data, message: `✓ Conectado a ${API_CONFIG.PRODUCTS_BFF}` }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        products: { success: false, error: error.message, message: `✗ Error conectando a ${API_CONFIG.PRODUCTS_BFF}` }
      }));
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  // Probar conexión con Customers BFF (endpoint de login - espera error 401)
  const testAuth = async () => {
    setLoading(prev => ({ ...prev, auth: true }));
    try {
      // Intentamos login con credenciales falsas solo para verificar conectividad
      await login({ email: 'test@test.com', password: 'test123' });
    } catch (error) {
      // Si obtenemos un error 401 o mensaje del servidor, significa que SÍ hay conexión
      const isConnected = error.message !== 'No se pudo conectar con el servidor';
      setResults(prev => ({
        ...prev,
        auth: {
          success: isConnected,
          error: error.message,
          message: isConnected 
            ? `✓ Conectado a ${API_CONFIG.CUSTOMERS_BFF} (respuesta del servidor recibida)`
            : `✗ Error conectando a ${API_CONFIG.CUSTOMERS_BFF}`
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, auth: false }));
    }
  };

  // Probar conexión con Cart (simple fetch al endpoint base)
  const testCart = async () => {
    setLoading(prev => ({ ...prev, cart: true }));
    try {
      const response = await fetch(`${API_CONFIG.CART}/api/Cart/getCartById/1`);
      const isConnected = response.ok || response.status === 401 || response.status === 404;
      
      setResults(prev => ({
        ...prev,
        cart: {
          success: isConnected,
          status: response.status,
          message: isConnected
            ? `✓ Conectado a ${API_CONFIG.CART} (Status: ${response.status})`
            : `✗ Error conectando a ${API_CONFIG.CART}`
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        cart: {
          success: false,
          error: error.message,
          message: `✗ Error conectando a ${API_CONFIG.CART}`
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, cart: false }));
    }
  };

  // Probar todas las conexiones
  const testAll = () => {
    testProducts();
    testAuth();
    testCart();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🔌 Test de Conexión Backend</h2>
      <p style={{ color: '#666' }}>Verifica que los microservicios backend estén funcionando</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testAll}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Probar Todas las Conexiones
        </button>
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {/* Products BFF */}
        <div style={cardStyle}>
          <h3>Products BFF ({API_CONFIG.PRODUCTS_BFF})</h3>
          <button 
            onClick={testProducts} 
            disabled={loading.products}
            style={buttonStyle}
          >
            {loading.products ? 'Probando...' : 'Probar Products'}
          </button>
          {results.products && (
            <div style={getResultStyle(results.products.success)}>
              <strong>{results.products.message}</strong>
              {results.products.data && (
                <p>Productos encontrados: {results.products.data.length || Object.keys(results.products.data).length}</p>
              )}
              {results.products.error && <p>Error: {results.products.error}</p>}
            </div>
          )}
        </div>

        {/* Customers BFF */}
        <div style={cardStyle}>
          <h3>Customers BFF ({API_CONFIG.CUSTOMERS_BFF})</h3>
          <button 
            onClick={testAuth} 
            disabled={loading.auth}
            style={buttonStyle}
          >
            {loading.auth ? 'Probando...' : 'Probar Auth'}
          </button>
          {results.auth && (
            <div style={getResultStyle(results.auth.success)}>
              <strong>{results.auth.message}</strong>
              {results.auth.error && <p>Respuesta: {results.auth.error}</p>}
            </div>
          )}
        </div>

        {/* Cart */}
        <div style={cardStyle}>
          <h3>Cart Service ({API_CONFIG.CART})</h3>
          <button 
            onClick={testCart} 
            disabled={loading.cart}
            style={buttonStyle}
          >
            {loading.cart ? 'Probando...' : 'Probar Cart'}
          </button>
          {results.cart && (
            <div style={getResultStyle(results.cart.success)}>
              <strong>{results.cart.message}</strong>
              {results.cart.status && <p>Status HTTP: {results.cart.status}</p>}
              {results.cart.error && <p>Error: {results.cart.error}</p>}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>📝 Notas:</h4>
        <ul style={{ fontSize: '14px', color: '#666' }}>
          <li>Asegúrate de que todos los microservicios backend estén corriendo</li>
          <li>Los errores 401 (No autorizado) o 404 (No encontrado) indican que SÍ hay conexión</li>
          <li>Si ves "No se pudo conectar", verifica que el backend esté ejecutándose</li>
          <li>Revisa la consola del navegador (F12) para ver logs detallados</li>
        </ul>
      </div>
    </div>
  );
}

// Estilos
const cardStyle = {
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: '#fff',
};

const buttonStyle = {
  padding: '8px 16px',
  fontSize: '14px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '10px',
};

const getResultStyle = (success) => ({
  marginTop: '15px',
  padding: '15px',
  borderRadius: '5px',
  backgroundColor: success ? '#d4edda' : '#f8d7da',
  border: `1px solid ${success ? '#c3e6cb' : '#f5c6cb'}`,
  color: success ? '#155724' : '#721c24',
});
