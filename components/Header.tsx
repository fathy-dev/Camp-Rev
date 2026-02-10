
import React from 'react';
import { ViewMode, Campaign } from '../types';
import { useAuth } from './AuthContext';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeCampaign: Campaign | null;
  onBack: () => void;
  onShare: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveStatus: 'idle' | 'saving' | 'saved';
  canCreateCampaign: boolean;
  canImportExport: boolean;
  canShare: boolean;
}

const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  activeCampaign,
  onBack,
  onShare,
  onExport,
  onImport,
  saveStatus,
  canCreateCampaign,
  canImportExport,
  canShare
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur-2xl border-b border-slate-100 h-20 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-8 h-full flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 pr-6 border-r border-slate-100 shrink-0 cursor-pointer" onClick={onBack}>
            <div className="w-10 h-10 bg-slate-900 rounded-[14px] flex items-center justify-center text-white shadow-2xl group">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-black text-slate-900 text-2xl tracking-tighter hidden sm:block">CampaignFlow</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
              title="Back to Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            {activeCampaign && (
              <div className="flex flex-col">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">{activeCampaign.name}</h2>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'saved' ? 'bg-green-500' : 'bg-orange-400'}`} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{saveStatus === 'saved' ? 'Saved' : 'Saving...'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-5 shrink-0">
          {canShare && (
            <button
              onClick={onShare}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Share
            </button>
          )}

          {viewMode === 'Portfolio' && canImportExport && (
            <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
              {/* Export/Import buttons preserved */}
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
