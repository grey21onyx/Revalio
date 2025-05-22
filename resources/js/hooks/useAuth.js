import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

/**
 * Custom hook untuk mengakses AuthContext
 * 
 * @returns {Object} Objek dengan state dan fungsi autentikasi:
 * - isAuthenticated: boolean
 * - user: object
 * - isLoading: boolean
 * - error: string
 * - success: string
 * - login: function
 * - register: function
 * - logout: function
 * - clearError: function
 * - clearSuccess: function
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Re-export hook langsung untuk backward compatibility
export default useAuth;
