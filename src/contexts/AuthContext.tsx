import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginForm, RegisterForm, UserRole } from '@/types';
import { validateEmail } from '@/lib/utils';
import { apiService } from '@/services/api.service';

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

interface AuthContextType extends AuthState {
  login: (credentials: LoginForm) => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

// Database users will be loaded from SQLite

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    let isMounted = true;
    
    const initAuth = async () => {
      console.log('[AuthContext] Initializing auth...');
      
      try {
        const token = localStorage.getItem('designflow_token');
        console.log('[AuthContext] Token exists:', !!token);

        if (token) {
          // Add timeout to prevent infinite loading
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Auth timeout')), 10000)
          );
          
          const authPromise = apiService.getCurrentUser();
          
          // Race between API call and timeout
          const response = await Promise.race([authPromise, timeoutPromise]);
          
          if (isMounted) {
            if (response && response.user) {
              console.log('[AuthContext] User authenticated:', response.user.email);
              dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
            } else {
              console.log('[AuthContext] Invalid response, logging out');
              localStorage.removeItem('designflow_token');
              localStorage.removeItem('designflow_user');
              dispatch({ type: 'AUTH_LOGOUT' });
            }
          }
        } else {
          console.log('[AuthContext] No token found, user not authenticated');
          if (isMounted) {
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        }
      } catch (error: any) {
        console.error('[AuthContext] Init error:', error.message);
        if (isMounted) {
          localStorage.removeItem('designflow_token');
          localStorage.removeItem('designflow_user');
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      }
    };

    // Execute with small delay to prevent blocking
    const timer = setTimeout(() => {
      initAuth();
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const login = async (credentials: LoginForm): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Validate input
      if (!validateEmail(credentials.email)) {
        throw new Error('Email tidak valid');
      }

      if (!credentials.password || credentials.password.length < 6) {
        throw new Error('Password minimal 6 karakter');
      }

      // Call API
      const response = await apiService.login(credentials.email, credentials.password);
      
      // Save token and user to localStorage
      localStorage.setItem('designflow_token', response.token);
      localStorage.setItem('designflow_user', JSON.stringify(response.user));

      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Login gagal';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      throw new Error(message);
    }
  };

  const register = async (data: RegisterForm): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Validate input
      if (!data.name.trim()) {
        throw new Error('Nama harus diisi');
      }
      if (!validateEmail(data.email)) {
        throw new Error('Email tidak valid');
      }
      if (data.password.length < 6) {
        throw new Error('Password minimal 6 karakter');
      }
      if (!data.agreeToTerms) {
        throw new Error('Anda harus menyetujui syarat dan ketentuan');
      }

      // Call API
      const response = await apiService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.role,
      });

      // Save token and user to localStorage
      localStorage.setItem('designflow_token', response.token);
      localStorage.setItem('designflow_user', JSON.stringify(response.user));

      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Registrasi gagal';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('designflow_token');
    localStorage.removeItem('designflow_user');
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateUser = async (updates: Partial<User>) => {
    if (state.user) {
      try {
        const response = await apiService.updateUser(state.user.id, updates);
        const updatedUser = response.user;
        localStorage.setItem('designflow_user', JSON.stringify(updatedUser));
        dispatch({ type: 'UPDATE_USER', payload: updates });
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper function to check if user has specific role
export function hasRole(user: User | null, role: UserRole): boolean {
  return user?.role === role || false;
}

// Helper function to check if user has any of the specified roles
export function hasAnyRole(user: User | null, roles: string[]): boolean {
  return user ? roles.includes(user.role) : false;
}

// Helper function to check if user can access specific feature
export function canAccessFeature(user: User | null, feature: 'admin' | 'design' | 'review' | 'approve' | 'print'): boolean {
  if (!user) return false;

  switch (feature) {
    case 'admin':
      return hasRole(user, 'admin');
    case 'design':
      return hasAnyRole(user, ['designer_internal', 'designer_external']);
    case 'review':
      return hasRole(user, 'reviewer');
    case 'approve':
      return hasRole(user, 'approver');
    case 'print':
      return hasRole(user, 'designer_external');
    default:
      return false;
  }
}
