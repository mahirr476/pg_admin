// // src/components/providers/auth-provider.tsx
// "use client";

// import { SessionProvider } from "next-auth/react";

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   return <SessionProvider>{children}</SessionProvider>;
// }

"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check for token in both localStorage and cookies
    const token = localStorage.getItem('accessToken') || Cookies.get('token');
    if (token) {
      setIsAuthenticated(true);
      
      // You can also fetch user data here if needed
      // const userData = fetchUserData(token);
      // setUser(userData);
    }
  }, []);

  const login = (token: string) => {
    // Store token in both localStorage and cookies for redundancy
    localStorage.setItem('accessToken', token);
    Cookies.set('token', token, { expires: 7 }); // Expires in 7 days
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear token from both localStorage and cookies
    localStorage.removeItem('accessToken');
    Cookies.remove('token');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  // Provide the authentication status and functions to children
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);