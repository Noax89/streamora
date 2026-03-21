import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  verifyEmail: () => Promise<void>;
  changePassword: (password: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const savedUser = localStorage.getItem('streamora_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser = { id: '1', email, name: email.split('@')[0], isVerified: true };
    setUser(newUser);
    localStorage.setItem('streamora_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const register = async (email: string, _password: string, name: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser = { id: '2', email, name, isVerified: false };
    setUser(newUser);
    localStorage.setItem('streamora_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('streamora_user');
  };

  const verifyEmail = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (user) {
      const updatedUser = { ...user, isVerified: true };
      setUser(updatedUser);
      localStorage.setItem('streamora_user', JSON.stringify(updatedUser));
    }
    setIsLoading(false);
  };

  const changePassword = async (_password: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, verifyEmail, changePassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
