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
  googleId: string | null;
  createdAt?: string;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshStreak: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
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

  // Helper to fetch user profile + gamification data
  const fetchUserData = async (token: string) => {
    try {
      const [profileRes, leaderboardRes] = await Promise.all([
        fetch(`${API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/leaderboard`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        let rank = 0;

        if (leaderboardRes.ok) {
          const leaderboardData = await leaderboardRes.json();
          rank = leaderboardData.currentUser?.rank || 0;
        }

        setUser({
          id: profileData.id,
          name: profileData.name || 'User',
          email: profileData.email || '',
          points: profileData.points || 0,
          rank,
          streak: profileData.streak || { count: 0, lastActive: null },
          googleId: profileData.googleId || null,
          createdAt: profileData.createdAt,
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

  // Update Profile
  const updateProfile = async (data: UpdateProfileData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.msg || 'Failed to update profile');
    }

    // Refresh user data after successful update
    await fetchUserData(token);
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
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};