import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Campaign, Post } from '../types';
import { useAuth } from './AuthContext';

interface CampaignContextType {
    campaigns: Campaign[];
    activeCampaign: Campaign | null;
    activeCampaignId: string | null;
    setActiveCampaignId: (id: string | null) => void;
    createCampaign: (name: string, description: string) => void;
    updateCampaign: (id: string, updates: Partial<Campaign>) => void;
    deleteCampaign: (id: string) => void;
    shareCampaign: (id: string, email: string) => void;
    removeSharedUser: (id: string, email: string) => void;
    generateShareLink: (id: string) => string;
    revokeShareLink: (id: string) => void;
    isSharedAccess: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
    importCampaigns: (data: Campaign[]) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

const STORAGE_KEY = 'campaignflow_data';

const INITIAL_CAMPAIGN: Campaign = {
    id: 'c1',
    name: 'Brand Evolution 2025',
    subtitle: 'Defining the Next Chapter',
    description: 'A comprehensive brand campaign.',
    logo: null,
    date: 'Autumn 2025',
    posts: [],
    ownerId: 'u1', // Default to admin for initial data
    createdAt: new Date().toISOString(),
    isPublic: false,
    shareToken: null,
    sharedWith: []
};

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Migration: Ensure all campaigns have new fields
                return parsed.map((c: any) => ({
                    ...c,
                    ownerId: c.ownerId || 'u1',
                    createdAt: c.createdAt || new Date().toISOString(),
                    sharedWith: c.sharedWith || [],
                    isPublic: c.isPublic || false,
                    shareToken: c.shareToken || null
                }));
            } catch (e) {
                console.error("Failed to parse campaigns", e);
                return [INITIAL_CAMPAIGN];
            }
        }
        return [INITIAL_CAMPAIGN];
    });
    const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    }, [campaigns]);

    // Handle URL parameters for shared links (Simulation)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const pathParts = window.location.pathname.split('/');
        // Assuming path is like /campaign/:id
        // In this single-page app without router, we might just look for ?campaignId=... or rely on internal state
        // But the requirement says "Create shareable URL: /campaign/:id?token=shareToken"
        // Since we are using Vite and likely hash or simple routing, I'll check if we can simulate this.
        // For now, let's assume valid ID is passed via standard routing or just state.

        // Simulating "Opening link": check if current URL has token
        if (token) {
            // Find campaign with this token
            const campaign = campaigns.find(c => c.shareToken === token);
            if (campaign) {
                setActiveCampaignId(campaign.id);
            }
        }
    }, [campaigns]);

    const activeCampaign = campaigns.find(c => c.id === activeCampaignId) || null;

    // Determine Permissions
    const isOwner = user && activeCampaign?.ownerId === user.id;
    const isSharedUser = user && activeCampaign?.sharedWith.includes(user.email);
    const isPublicAccess = activeCampaign?.isPublic && activeCampaign?.shareToken;

    // Check if we are in "Public View" mode (no user logged in, or token present)
    const params = new URLSearchParams(window.location.search);
    const hasToken = !!params.get('token');

    const isSharedAccess = !!(hasToken && isPublicAccess) || !!isSharedUser;

    // Permissions
    const canEdit = !!(isOwner || (isSharedUser && user?.role !== 'viewer')); // Editors can edit
    const canDelete = !!isOwner;
    const canShare = !!isOwner;

    const createCampaign = useCallback((name: string, description: string) => {
        if (!user) return;
        const newCampaign: Campaign = {
            id: `c-${Date.now()}`,
            name,
            subtitle: 'New Campaign',
            description,
            logo: null,
            date: new Date().toLocaleDateString(),
            posts: [],
            ownerId: user.id,
            createdAt: new Date().toISOString(),
            isPublic: false,
            shareToken: null,
            sharedWith: []
        };
        setCampaigns(prev => [...prev, newCampaign]);
        setActiveCampaignId(newCampaign.id);
    }, [user]);

    const updateCampaign = useCallback((id: string, updates: Partial<Campaign>) => {
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    }, []);

    const deleteCampaign = useCallback((id: string) => {
        setCampaigns(prev => prev.filter(c => c.id !== id));
        if (activeCampaignId === id) setActiveCampaignId(null);
    }, [activeCampaignId]);

    const shareCampaign = useCallback((id: string, email: string) => {
        setCampaigns(prev => prev.map(c => {
            if (c.id !== id) return c;
            if (c.sharedWith.includes(email)) return c;
            return { ...c, sharedWith: [...c.sharedWith, email] };
        }));
    }, []);

    const removeSharedUser = useCallback((id: string, email: string) => {
        setCampaigns(prev => prev.map(c => {
            if (c.id !== id) return c;
            return { ...c, sharedWith: c.sharedWith.filter(e => e !== email) };
        }));
    }, []);

    const generateShareLink = useCallback((id: string) => {
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, isPublic: true, shareToken: token } : c));
        return `${window.location.origin}/campaign/${id}?token=${token}`;
    }, []);

    const revokeShareLink = useCallback((id: string) => {
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, isPublic: false, shareToken: null } : c));
    }, []);

    const importCampaigns = useCallback((data: Campaign[]) => {
        setCampaigns(data);
        if (data.length > 0) setActiveCampaignId(data[0].id);
    }, []);

    return (
        <CampaignContext.Provider value={{
            campaigns,
            activeCampaign,
            activeCampaignId,
            setActiveCampaignId,
            createCampaign,
            updateCampaign,
            deleteCampaign,
            shareCampaign,
            removeSharedUser,
            generateShareLink,
            revokeShareLink,
            importCampaigns,
            isSharedAccess,
            canEdit,
            canDelete,
            canShare
        }}>
            {children}
        </CampaignContext.Provider>
    );
};

export const useCampaign = () => {
    const context = useContext(CampaignContext);
    if (!context) throw new Error('useCampaign must be used within CampaignProvider');
    return context;
};
