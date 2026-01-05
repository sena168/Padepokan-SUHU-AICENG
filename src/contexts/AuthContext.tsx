import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { GoogleOAuth } from '@/utils/googleOAuth';

export interface User {
  id: string;
  nickname: string;
  email: string;
  createdAt: string;
  avatar?: string;
  provider?: 'local' | 'google';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    nickname: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user storage - in a real app, this would be a backend API
const mockUsers: User[] = [];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('padepokan_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('padepokan_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in a real app, this would call an API
    // For demo purposes, we'll use localStorage to simulate user persistence
    const storedUsers = localStorage.getItem('padepokan_users');
    const users = storedUsers ? JSON.parse(storedUsers) : mockUsers;

    const foundUser = users.find((u: User) => u.email === email);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('padepokan_user', JSON.stringify(foundUser));
      return true;
    }

    return false;
  };

  const signup = async (
    nickname: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    // Mock signup - in a real app, this would call an API
    const storedUsers = localStorage.getItem('padepokan_users');
    const users = storedUsers ? JSON.parse(storedUsers) : mockUsers;

    // Check if user already exists
    if (users.find((u: User) => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      nickname,
      email,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('padepokan_users', JSON.stringify(updatedUsers));

    setUser(newUser);
    localStorage.setItem('padepokan_user', JSON.stringify(newUser));
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    if (!GoogleOAuth.isConfigured()) {
      console.warn('Google OAuth is not configured');
      return false;
    }

    try {
      // Handle Google OAuth callback if we're returning from Google
      const { code, error } = GoogleOAuth.handleCallback();

      if (error) {
        console.error('Google OAuth error:', error);
        return false;
      }

      if (code) {
        // In a real implementation, you would exchange the code for tokens
        // For this demo, we'll create a mock Google user
        const googleUser: User = {
          id: `google-${Date.now()}`,
          nickname: 'Google User',
          email: 'google-user@example.com',
          createdAt: new Date().toISOString(),
          avatar: 'https://via.placeholder.com/150',
          provider: 'google',
        };

        setUser(googleUser);
        localStorage.setItem('padepokan_user', JSON.stringify(googleUser));
        return true;
      }

      // If no code, initiate Google OAuth flow
      GoogleOAuth.initiateLogin();
      return true; // Return true as the flow has been initiated
    } catch (error) {
      console.error('Google OAuth error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('padepokan_user');
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
