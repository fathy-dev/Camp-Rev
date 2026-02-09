/**
 * Frontend-only auth simulation. Replace with real backend authentication in production.
 * Protected route wrapper that checks authentication and role permissions.
 */

import React, { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { UserRole, ROLE_PERMISSIONS } from '../types';
import AccessDenied from './AccessDenied';
import LoginPage from './LoginPage';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: UserRole[];
    requiredPermission?: keyof typeof ROLE_PERMISSIONS.admin;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    requiredPermission
}) => {
    const { isAuthenticated, isLoading, user, hasPermission } = useAuth();

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <LoginPage />;
    }

    // Check role-based access
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <AccessDenied />;
    }

    // Check permission-based access
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <AccessDenied />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
