
export type Platform = 'Instagram' | 'Facebook' | 'LinkedIn';

export interface PostCaptions {
  Instagram: string;
  Facebook: string;
  LinkedIn: string;
}

export interface Engagement {
  likes: number;
  comments: number;
  shares: number;
}

export interface Post {
  id: string;
  profileName: string;
  profileImage: string | null;
  linkedinJobTitle: string;
  media: string[];
  captions: PostCaptions;
  engagement: Engagement;
  platforms: Platform[];
  showOnAll: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  logo: string | null;
  date: string;
  posts: Post[];
}

export type ViewMode = 'Portfolio' | 'Approval';

/**
 * Frontend-only auth simulation. Replace with real backend authentication in production.
 */
export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Role-based permissions
export const ROLE_PERMISSIONS = {
  admin: {
    canViewPortfolio: true,
    canViewApproval: true,
    canCreatePost: true,
    canEditPost: true,
    canDeletePost: true,
    canCreateCampaign: true,
    canDeleteCampaign: true,
    canImportExport: true,
  },
  editor: {
    canViewPortfolio: true,
    canViewApproval: true,
    canCreatePost: true,
    canEditPost: true,
    canDeletePost: false,
    canCreateCampaign: true,
    canDeleteCampaign: false,
    canImportExport: true,
  },
  viewer: {
    canViewPortfolio: false,
    canViewApproval: true,
    canCreatePost: false,
    canEditPost: false,
    canDeletePost: false,
    canCreateCampaign: false,
    canDeleteCampaign: false,
    canImportExport: false,
  },
} as const;
