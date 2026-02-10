import React, { useState } from 'react';
import { useCampaign } from './CampaignContext';

interface ShareModalProps {
    campaignId: string;
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ campaignId, onClose }) => {
    const { campaigns, shareCampaign, removeSharedUser, generateShareLink, revokeShareLink } = useCampaign();
    const campaign = campaigns.find(c => c.id === campaignId);

    const [email, setEmail] = useState('');
    const [copied, setCopied] = useState(false);
    const [generatedLink, setGeneratedLink] = useState(campaign?.shareToken ? `${window.location.origin}/campaign/${campaign.id}?token=${campaign.shareToken}` : '');

    if (!campaign) return null;

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            shareCampaign(campaignId, email.trim());
            setEmail('');
        }
    };

    const handleGenerateLink = () => {
        const link = generateShareLink(campaignId);
        setGeneratedLink(link);
    };

    const handleRevokeLink = () => {
        revokeShareLink(campaignId);
        setGeneratedLink('');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-slate-100 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Share Campaign</h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">Manage access to {campaign.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                </div>

                <div className="p-8 overflow-y-auto space-y-8">

                    {/* Public Link Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${campaign.isPublic ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Public Link</h3>
                                    <p className="text-xs text-slate-500 font-medium">Anyone with the link can view (Approval Mode)</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={campaign.isPublic}
                                        onChange={() => campaign.isPublic ? handleRevokeLink() : handleGenerateLink()}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        </div>

                        {campaign.isPublic && generatedLink && (
                            <div className="flex gap-2">
                                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 font-medium truncate select-all">
                                    {generatedLink}
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'}`}
                                >
                                    {copied ? (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            Copied
                                        </>
                                    ) : (
                                        'Copy'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Invite Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Invite People</h3>
                                <p className="text-xs text-slate-500 font-medium">Invite collaborators via email</p>
                            </div>
                        </div>

                        <form onSubmit={handleInvite} className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="colleague@example.com"
                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!email.trim()}
                                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Invite
                            </button>
                        </form>

                        {/* Shared Users List */}
                        <div className="space-y-3 mt-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Access List</h4>
                            <div className="space-y-2">
                                {/* Owner */}
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs ring-2 ring-white">
                                            {campaign.ownerId.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Owner</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-lg">Owner</span>
                                </div>

                                {/* Shared Users */}
                                {campaign.sharedWith.length === 0 && (
                                    <p className="text-sm text-slate-400 italic px-3">No one invited yet</p>
                                )}
                                {campaign.sharedWith.map(userEmail => (
                                    <div key={userEmail} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs ring-2 ring-white">
                                                {userEmail.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{userEmail}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg">Editor</span>
                                            <button
                                                onClick={() => removeSharedUser(campaignId, userEmail)}
                                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                                title="Remove Access"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Security Note */}
                <div className="px-8 py-4 bg-slate-50 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 text-center font-medium">
                        ⓘ Frontend-only simulation. Links work in this browser session. Secure sharing requires backend implementation.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
