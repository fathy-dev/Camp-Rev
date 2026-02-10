import React, { useState } from 'react';
import { useCampaign } from './CampaignContext';
import { useAuth } from './AuthContext';
import { Campaign } from '../types';

interface CampaignListDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CampaignListDrawer: React.FC<CampaignListDrawerProps> = ({ isOpen, onClose }) => {
    const { campaigns, activeCampaignId, setActiveCampaignId, createCampaign } = useCampaign();
    const { user, hasPermission } = useAuth();
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newSubtitle, setNewSubtitle] = useState('');

    const canCreate = hasPermission('canCreateCampaign');

    const filteredCampaigns = campaigns.filter(c => {
        if (!user) return c.isPublic; // Anonymous sees public only
        if (c.ownerId === user.id) return true; // Owner
        if (c.sharedWith.includes(user.email)) return true; // Shared
        if (c.isPublic) return true; // Public
        return false;
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName && newSubtitle) {
            createCampaign(newName, newSubtitle);
            setIsCreating(false);
            setNewName('');
            setNewSubtitle('');
            onClose();
        }
    };

    const handleSelect = (id: string) => {
        setActiveCampaignId(id);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-80 bg-white shadow-2xl flex flex-col h-full animate-slide-right">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Campaigns</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {filteredCampaigns.map(c => {
                        const isOwner = user?.id === c.ownerId;
                        const isActive = c.id === activeCampaignId;

                        return (
                            <button
                                key={c.id}
                                onClick={() => handleSelect(c.id)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all group ${isActive
                                        ? 'bg-indigo-50 border-indigo-200 shadow-md ring-1 ring-indigo-500/20'
                                        : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-lg'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-bold text-sm truncate pr-2 ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>{c.name}</h3>
                                    {isOwner ? (
                                        <span className="shrink-0 text-[9px] font-black uppercase text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded">Owner</span>
                                    ) : c.isPublic ? (
                                        <span className="shrink-0 text-[9px] font-black uppercase text-emerald-400 bg-emerald-50 px-1.5 py-0.5 rounded">Public</span>
                                    ) : (
                                        <span className="shrink-0 text-[9px] font-black uppercase text-purple-400 bg-purple-50 px-1.5 py-0.5 rounded">Shared</span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-400 truncate">{c.subtitle}</p>
                                <p className="text-[10px] text-slate-300 mt-2 font-medium">Last updated {new Date(c.date).toLocaleDateString()}</p>
                            </button>
                        );
                    })}
                </div>

                {canCreate && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50">
                        {!isCreating ? (
                            <button
                                onClick={() => setIsCreating(true)}
                                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                New Campaign
                            </button>
                        ) : (
                            <form onSubmit={handleCreate} className="space-y-3 animate-fade-in">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase">New Campaign</h3>
                                    <button type="button" onClick={() => setIsCreating(false)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
                                </div>
                                <input
                                    autoFocus
                                    placeholder="Campaign Name"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                                />
                                <input
                                    placeholder="Subtitle"
                                    value={newSubtitle}
                                    onChange={e => setNewSubtitle(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                                />
                                <button
                                    type="submit"
                                    disabled={!newName || !newSubtitle}
                                    className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Create
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampaignListDrawer;
