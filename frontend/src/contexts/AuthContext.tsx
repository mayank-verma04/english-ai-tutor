import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config/constants';

interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  rank: number;
  streak: {
    count: number;
    lastActive: string | null;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>; // Added this
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshStreak: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to fetch gamification data (streak, leaderboard)
  const fetchUserData = async (token: string) => {
    try {
      const [streakResponse, leaderboardResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/streak`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/leaderboard`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (streakResponse.ok && leaderboardResponse.ok) {
        const streakData = await streakResponse.json();
        const leaderboardData = await leaderboardResponse.json();
        const currentUserData = leaderboardData.currentUser;

        // Ensure we have a fallback for ID if leaderboard structure varies
        const userId = currentUserData?.userId || token;

        setUser({
          id: userId,
          name: currentUserData?.name || 'User',
          email: currentUserData?.email || 'user@example.com',
          points: currentUserData?.points || 0,
          rank: currentUserData?.rank || 0,
          streak: streakData,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    await fetchUserData(token);
  };

  const refreshStreak = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/streak`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const streakData = await response.json();
        setUser((prev) => (prev ? { ...prev, streak: streakData } : null));
      }
    } catch (error) {
      console.error('Error refreshing streak:', error);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await fetchUserData(token);
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  // Standard Login
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      localStorage.setItem('token', data.token);
      await fetchUserData(data.token);
    } catch (error) {
      throw error;
    }
  };

  // Google Login
  const googleLogin = async (googleToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.msg || 'Google Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      await fetchUserData(data.token);
    } catch (error) {
      throw error;
    }
  };

  // Register
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) throw new Error('Registration failed');

      // Auto-login after register
      await login(email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    googleLogin,
    register,
    logout,
    isLoading,
    refreshStreak,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};