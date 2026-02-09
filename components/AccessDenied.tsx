/**
 * Frontend-only auth simulation. Replace with real backend authentication in production.
 * Access denied screen for unauthorized users.
 */

import React from 'react';
import { useAuth } from './AuthContext';

const AccessDenied: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                {/* Icon */}
                <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border-2 border-red-100">
                    <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
                    Access Denied
                </h1>

                {/* Message */}
                <p className="text-slate-500 text-lg mb-8">
                    Sorry, your role doesn't have permission to view this content.
                </p>

                {/* Role Badge */}
                {user && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-8">
                        <span className="text-slate-500 text-sm">Signed in as:</span>
                        <span className="text-slate-700 font-bold text-sm">{user.name}</span>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-emerald-100 text-emerald-700' :
                                user.role === 'editor' ? 'bg-blue-100 text-blue-700' :
                                    'bg-slate-200 text-slate-600'
                            }`}>
                            {user.role}
                        </span>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={logout}
                        className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;
