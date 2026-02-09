
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
