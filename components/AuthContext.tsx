/**
 * Frontend-only auth simulation. Replace with real backend authentication in production.
 * This module provides authentication context, provider, and hooks for the Campaign Viewer app.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, UserRole, AuthState, ROLE_PERMISSIONS } from '../types';

// Demo users - hardcoded for frontend-only auth
const DEMO_USERS: Array<{ email: string; password: string; user: User }> = [
    {
        email: 'admin@example.com',
        password: 'admin123',
        user: { id: 'u1', email: 'admin@example.com', name: 'Admin User', role: 'admin' }
    },
    {
        email: 'editor@example.com',
        password: 'editor123',
        user: { id: 'u2', email: 'editor@example.com', name: 'Editor User', role: 'editor' }
    },
    {
        email: 'viewer@example.com',
        password: 'viewer123',
        user: { id: 'u3', email: 'viewer@example.com', name: 'Viewer User', role: 'viewer' }
    }
];

// LocalStorage keys
const AUTH_STORAGE_KEYS = {
    USER: 'auth_user',
    TOKEN: 'auth_token',
    TIMESTAMP: 'auth_timestamp'
} as const;

// Generate mock token
const generateMockToken = (): string => {
    return `mock_token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    hasPermission: (permission: keyof typeof ROLE_PERMISSIONS.admin) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true
    });

    // Check for existing session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
        const storedToken = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);

        if (storedUser && storedToken) {
            try {
                const user = JSON.parse(storedUser) as User;
                setAuthState({
                    user,
                    isAuthenticated: true,
                    isLoading: false
                });
            } catch {
                // Invalid stored data, clear it
                localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
                localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
                localStorage.removeItem(AUTH_STORAGE_KEYS.TIMESTAMP);
                setAuthState({ user: null, isAuthenticated: false, isLoading: false });
            }
        } else {
            setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        }
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const matchedUser = DEMO_USERS.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!matchedUser) {
            return { success: false, error: 'Invalid email or password' };
        }

        // Store in localStorage
        const token = generateMockToken();
        localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(matchedUser.user));
        localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(AUTH_STORAGE_KEYS.TIMESTAMP, Date.now().toString());

        setAuthState({
            user: matchedUser.user,
            isAuthenticated: true,
            isLoading: false
        });

        return { success: true };
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
        localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
        localStorage.removeItem(AUTH_STORAGE_KEYS.TIMESTAMP);

        setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
        });
    }, []);

    const hasPermission = useCallback((permission: keyof typeof ROLE_PERMISSIONS.admin): boolean => {
        if (!authState.user) return false;
        return ROLE_PERMISSIONS[authState.user.role][permission];
    }, [authState.user]);

    return (
        <AuthContext.Provider value={{ ...authState, login, logout, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Helper hook for checking specific permissions
export const usePermission = (permission: keyof typeof ROLE_PERMISSIONS.admin): boolean => {
    const { hasPermission } = useAuth();
    return hasPermission(permission);
};

export default AuthContext;
