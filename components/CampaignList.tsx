import React, { useState } from 'react';
import { useCampaign } from './CampaignContext';
import { useAuth } from './AuthContext';

const CampaignList: React.FC = () => {
    const { campaigns, setActiveCampaignId, createCampaign, deleteCampaign } = useCampaign();
    const { user } = useAuth();
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim()) {
            createCampaign(newName, newDesc);
            setIsCreating(false);
            setNewName('');
            setNewDesc('');
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch {
            return dateString;
        }
    };

    if (isCreating) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-slate-100 p-8">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Create New Campaign</h2>
                    <form onSubmit={handleCreate} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Campaign Name</label>
                            <input
                                autoFocus
                                type="text"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Summer Launch 2025"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                            <textarea
                                value={newDesc}
                                onChange={e => setNewDesc(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-32 resize-none"
                                placeholder="Briefly describe the campaign goals..."
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="flex-1 py-3 px-6 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 px-6 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                            >
                                Create Campaign
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-6 sm:p-12">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Campaigns</h1>
                        <p className="text-slate-500 mt-2 font-medium">Manage and organize your marketing initiatives</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="btn-primary flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        New Campaign
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map(campaign => {
                        const isOwner = user?.id === campaign.ownerId;
                        const isShared = !isOwner && campaign.sharedWith.includes(user?.email || '');

                        return (
                            <div key={campaign.id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col overflow-hidden relative">

                                {/* Status Badge */}
                                <div className="absolute top-4 right-4 z-10 flex gap-2">
                                    {isOwner && <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">Owner</span>}
                                    {isShared && <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">Shared</span>}
                                    {campaign.isPublic && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">Public</span>}
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{campaign.name}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-6">{campaign.description || "No description provided."}</p>

                                    <div className="mt-auto flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <span>{campaign.posts.length} Posts</span>
                                        <span>{formatDate(campaign.date)}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                                    <button
                                        onClick={() => setActiveCampaignId(campaign.id)}
                                        className="flex-1 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm"
                                    >
                                        Open Campaign
                                    </button>
                                    {isOwner && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm('Delete this campaign?')) deleteCampaign(campaign.id);
                                            }}
                                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                            title="Delete Campaign"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Empty State Create Button */}
                    <button
                        onClick={() => setIsCreating(true)}
                        className="group min-h-[300px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-indigo-300 hover:bg-indigo-50/10 transition-all"
                    >
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-600 group-hover:border-transparent group-hover:text-white transition-all duration-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <span className="font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">Create New Campaign</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignList;
