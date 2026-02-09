/**
 * Frontend-only auth simulation. Replace with real backend authentication in production.
 * Login page component with email/password form and error handling.
 */

import React, { useState, FormEvent } from 'react';
import { useAuth } from './AuthContext';
import RegisterPage from './RegisterPage';

const LoginPage: React.FC = () => {
    const { login, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    // Prevent logged-in users from accessing login page
    if (isAuthenticated) {
        return null;
    }

    if (isRegistering) {
        return <RegisterPage onSwitchToLogin={() => setIsRegistering(false)} />;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await login(email, password);
            if (!result.success) {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = (role: 'admin' | 'editor' | 'viewer') => {
        const credentials = {
            admin: { email: 'admin@example.com', pass: 'admin123' },
            editor: { email: 'editor@example.com', pass: 'editor123' },
            viewer: { email: 'viewer@example.com', pass: 'viewer123' }
        };

        const { email, pass } = credentials[role];
        setEmail(email);
        setPassword(pass);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <svg className="w-9 h-9 text-slate-900" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">CampaignFlow</h1>
                    <p className="text-slate-400 mt-2 text-sm">Sign in to manage your campaigns</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl">
                            <p className="text-red-200 text-sm font-medium text-center">{error}</p>
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="mb-5">
                        <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="you@example.com"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-8">
                        <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-slate-400 font-medium text-sm">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => setIsRegistering(true)}
                                className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                </form>

                {/* Demo Accounts Info */}
                <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-3">Demo Accounts</h3>
                    <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-1 gap-2">
                            {(['admin', 'editor', 'viewer'] as const).map(role => (
                                <button
                                    key={role}
                                    onClick={() => handleDemoLogin(role)}
                                    className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors group text-left w-full"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${role === 'admin' ? 'bg-emerald-500/20 text-emerald-300' :
                                                role === 'editor' ? 'bg-blue-500/20 text-blue-300' :
                                                    'bg-slate-500/20 text-slate-300'
                                            }`}>
                                            {role}
                                        </span>
                                        <span className="text-slate-400 group-hover:text-slate-200 transition-colors">
                                            {role}@example.com
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-500">123</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
