import React, { useState, FormEvent } from 'react';
import { useAuth } from './AuthContext';
import RegisterPage from './RegisterPage';

const LoginPage: React.FC = () => {
    const { login, loginWithGoogle, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

    const handleGoogleLogin = async () => {
        setError(null);
        setIsGoogleLoading(true);

        try {
            const result = await loginWithGoogle();
            if (!result.success) {
                setError(result.error || 'Google login failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsGoogleLoading(false);
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
                            disabled={isLoading || isGoogleLoading}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-8 relative">
                        <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-12"
                                placeholder="••••••••"
                                required
                                disabled={isLoading || isGoogleLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || isGoogleLoading}
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

                    {/* Google Login Button */}
                    <div className="mt-4 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-transparent text-slate-400 font-medium">Or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading || isGoogleLoading}
                        className="mt-4 w-full py-4 bg-white text-slate-700 font-bold rounded-2xl shadow-lg hover:bg-slate-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {isGoogleLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Connecting...
                            </span>
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </>
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
