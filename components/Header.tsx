
import React from 'react';
import { ViewMode, Campaign } from '../types';
import { useAuth } from './AuthContext';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeCampaignId: string;
  setActiveCampaignId: (id: string) => void;
  campaigns: Campaign[];
  onAddCampaign: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveStatus: 'idle' | 'saving' | 'saved';
  canCreateCampaign: boolean;
  canImportExport: boolean;
}

const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  activeCampaignId,
  setActiveCampaignId,
  campaigns,
  onAddCampaign,
  onExport,
  onImport,
  saveStatus,
  canCreateCampaign,
  canImportExport
}) => {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur-2xl border-b border-slate-100 h-20 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-8 h-full flex items-center justify-between gap-6">
        <div className="flex items-center gap-10 overflow-hidden">
          <div className="flex items-center gap-4 pr-10 border-r border-slate-100 shrink-0">
            <div className="w-10 h-10 bg-slate-900 rounded-[14px] flex items-center justify-center text-white shadow-2xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-black text-slate-900 text-2xl tracking-tighter hidden sm:block">CampaignFlow</span>
          </div>

          <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pr-4">
            {campaigns.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCampaignId(c.id)}
                className={`px-5 py-2.5 rounded-2xl text-[11px] font-black transition-all whitespace-nowrap uppercase tracking-[0.1em] ${activeCampaignId === c.id
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                {c.name}
              </button>
            ))}
            {canCreateCampaign && (
              <button
                onClick={onAddCampaign}
                className="w-10 h-10 shrink-0 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                title="Add New Campaign"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-5 shrink-0">
          {viewMode === 'Portfolio' && canImportExport && (
            <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
              <button
                onClick={onExport}
                className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                title="Download Workspace (JSON)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5 5-5m-5-7v12" /></svg>
              </button>
              <label className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all cursor-pointer" title="Import Workspace">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-5-7l-5 5m5-5l5 5m-5-5v12" /></svg>
                <input type="file" accept=".json" onChange={onImport} className="hidden" />
              </label>
            </div>
          )}

          {viewMode === 'Portfolio' && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
              <div className={`w-2 h-2 rounded-full ${saveStatus === 'saved' ? 'bg-green-500' : 'bg-orange-400 animate-pulse'}`} />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {saveStatus === 'saved' ? 'All Changes Saved' : 'Syncing...'}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setViewMode('Portfolio')}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'Portfolio'
                ? 'bg-white text-slate-900 shadow-xl'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setViewMode('Approval')}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'Approval'
                ? 'bg-white text-slate-900 shadow-xl'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Approval
            </button>
          </div>

          {/* User Info & Logout */}
          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-slate-700 text-sm font-bold">{user.name}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'text-emerald-600' :
                    user.role === 'editor' ? 'text-blue-600' : 'text-slate-500'
                  }`}>{user.role}</span>
              </div>
              <button
                onClick={logout}
                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Sign Out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
