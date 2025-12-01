import { useState, useEffect } from 'react';
import { 
  login as authLogin, 
  register as authRegister, 
  logout as authLogout,
  getCurrentUser,
  isAuthenticated as checkAuth
} from '../services/auth';

/**
 * Hook personalizado para manejar la autenticación
 * @returns {Object} - Estado y funciones de autenticación
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    const authenticated = checkAuth();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    }

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      const authenticated = checkAuth();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        setUser(getCurrentUser());
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Login
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authLogin(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRegister(userData);
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authLogout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError(err.message);
      // Aún si falla, limpiamos el estado local
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };
};

export default useAuth;
