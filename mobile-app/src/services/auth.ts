import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserCreate, UserLogin } from '../types';
import { apiClient } from './api';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

class AuthService {
  private user: User | null = null;
  private loading: boolean = true;
  private listeners: ((authState: { user: User | null; loading: boolean }) => void)[] = [];

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const savedUser = await AsyncStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          this.user = userData;
          
          // Verify token is still valid
          await apiClient.getCurrentUser();
        } catch (error) {
          // Token is invalid, clear storage
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('user');
          this.user = null;
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      this.loading = false;
      this.notifyListeners();
    }
  }

  async login(credentials: UserLogin): Promise<void> {
    try {
      const response = await apiClient.login(credentials);
      await AsyncStorage.setItem('access_token', response.access_token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      this.user = response.user;
      this.notifyListeners();
    } catch (error) {
      throw error;
    }
  }

  async register(userData: UserCreate): Promise<void> {
    try {
      const newUser = await apiClient.register(userData);
      this.user = newUser;
      this.notifyListeners();
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('user');
      this.user = null;
      this.notifyListeners();
    }
  }

  async refreshUser(): Promise<void> {
    try {
      const userData = await apiClient.getCurrentUser();
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      this.user = userData;
      this.notifyListeners();
    } catch (error) {
      throw error;
    }
  }

  async checkAuth(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) return false;
      
      await apiClient.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isLoading(): boolean {
    return this.loading;
  }

  addListener(listener: (authState: { user: User | null; loading: boolean }) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      listener({ user: this.user, loading: this.loading });
    });
  }
}

export const authService = new AuthService();
