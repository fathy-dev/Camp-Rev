
import React, { useState, useCallback, useEffect } from 'react';
import { Campaign, ViewMode, Post } from './types';
import Header from './components/Header';
import CampaignHero from './components/CampaignHero';
import PostCard from './components/PostCard';
import EditorDrawer from './components/EditorDrawer';

const INITIAL_CAMPAIGN: Campaign = {
  id: 'c1',
  name: 'Brand Evolution 2025',
  subtitle: 'Defining the Next Chapter',
  description: 'A comprehensive brand campaign showcasing the shift towards sustainable materials and modern aesthetics in our upcoming product line.',
  logo: null,
  date: 'Autumn 2025',
  posts: []
};

const App: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('campaignflow_data');
    return saved ? JSON.parse(saved) : [INITIAL_CAMPAIGN];
  });
  const [activeCampaignId, setActiveCampaignId] = useState<string>(campaigns[0].id);
  const [viewMode, setViewMode] = useState<ViewMode>('Portfolio');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const activeCampaign = campaigns.find(c => c.id === activeCampaignId) || campaigns[0];
  const editingPost = activeCampaign.posts.find(p => p.id === editingPostId);

  // Autosave simulation
  useEffect(() => {
    localStorage.setItem('campaignflow_data', JSON.stringify(campaigns));
    setSaveStatus('saving');
    const timer = setTimeout(() => setSaveStatus('saved'), 600);
    return () => clearTimeout(timer);
  }, [campaigns]);

  const updateCampaign = useCallback((updated: Campaign) => {
    setCampaigns(prev => prev.map(c => c.id === updated.id ? updated : c));
  }, []);

  const addCampaign = useCallback(() => {
    const id = `c-${Date.now()}`;
    const newCampaign: Campaign = {
      ...INITIAL_CAMPAIGN,
      id,
      name: `New Campaign ${campaigns.length + 1}`,
      posts: []
    };
    setCampaigns(prev => [...prev, newCampaign]);
    setActiveCampaignId(id);
  }, [campaigns.length]);

  const exportWorkspace = useCallback(() => {
    const dataStr = JSON.stringify(campaigns, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `campaignflow_workspace_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [campaigns]);

  const importWorkspace = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          setCampaigns(json);
          if (json.length > 0) setActiveCampaignId(json[0].id);
          alert('Workspace imported successfully.');
        }
      } catch (err) {
        alert('Failed to parse workspace file. Ensure it is a valid CampaignFlow JSON.');
      }
    };
    reader.readAsText(file);
  }, []);

  const duplicateCampaign = useCallback(() => {
    const id = `c-${Date.now()}`;
    const duplicated: Campaign = {
      ...activeCampaign,
      id,
      name: `${activeCampaign.name} (Copy)`,
      posts: activeCampaign.posts.map(p => ({ ...p, id: `p-${Math.random()}` }))
    };
    setCampaigns(prev => [...prev, duplicated]);
    setActiveCampaignId(id);
  }, [activeCampaign]);

  const addPost = useCallback(() => {
    const newPost: Post = {
      id: `p-${Date.now()}`,
      profileName: 'Brand Account',
      profileImage: null,
      linkedinJobTitle: 'Official Brand Page',
      media: [],
      captions: {
        Instagram: 'The wait is almost over. Sustainable luxury meets modern utility.',
        Facebook: 'Discover the collection that redefines our heritage. Launching Autumn 2025.',
        LinkedIn: 'Strategically pivoting towards circular materials without compromising on design integrity.'
      },
      engagement: { likes: 450, comments: 22, shares: 8 },
      platforms: ['Instagram'],
      showOnAll: true
    };
    updateCampaign({
      ...activeCampaign,
      posts: [...activeCampaign.posts, newPost]
    });
    setEditingPostId(newPost.id);
  }, [activeCampaign, updateCampaign]);

  const deletePost = useCallback((postId: string) => {
    if (confirm('Permanently remove this post block?')) {
      updateCampaign({
        ...activeCampaign,
        posts: activeCampaign.posts.filter(p => p.id !== postId)
      });
      if (editingPostId === postId) setEditingPostId(null);
    }
  }, [activeCampaign, updateCampaign, editingPostId]);

  const updatePost = useCallback((postId: string, data: Partial<Post>) => {
    updateCampaign({
      ...activeCampaign,
      posts: activeCampaign.posts.map(p => p.id === postId ? { ...p, ...data } : p)
    });
  }, [activeCampaign, updateCampaign]);

  const duplicatePost = useCallback((post: Post) => {
    const newPost = { ...post, id: `p-${Date.now()}` };
    updateCampaign({
      ...activeCampaign,
      posts: [...activeCampaign.posts, newPost]
    });
    setEditingPostId(newPost.id);
  }, [activeCampaign, updateCampaign]);

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-500 ${viewMode === 'Approval' ? 'bg-white' : 'bg-[#F9FAFB]'}`}>
      <Header 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        activeCampaignId={activeCampaignId}
        setActiveCampaignId={setActiveCampaignId}
        campaigns={campaigns}
        onAddCampaign={addCampaign}
        onExport={exportWorkspace}
        onImport={importWorkspace}
        saveStatus={saveStatus}
      />

      <main className="max-w-[900px] mx-auto px-6 mt-12 space-y-20">
        <CampaignHero 
          campaign={activeCampaign} 
          updateCampaign={updateCampaign} 
          viewMode={viewMode} 
          onDuplicate={duplicateCampaign}
        />

        <div className="space-y-16 pb-20">
          {activeCampaign.posts.length > 0 ? (
            activeCampaign.posts.map((post) => (
              <PostCard 
                key={post.id}
                post={post}
                viewMode={viewMode}
                isEditing={editingPostId === post.id}
                onEdit={() => setEditingPostId(post.id)}
                onDelete={() => deletePost(post.id)}
                onDuplicate={() => duplicatePost(post)}
              />
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Campaign is Empty</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-xs">Your campaign has no social posts yet. Switch to Portfolio Mode to begin building.</p>
              {viewMode === 'Portfolio' && (
                <button onClick={addPost} className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">Create First Post</button>
              )}
            </div>
          )}

          {viewMode === 'Portfolio' && (
            <button
              onClick={addPost}
              className="w-full py-20 border-2 border-dashed border-slate-200 rounded-[48px] text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex flex-col items-center justify-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-extrabold text-xl tracking-tight">Add Post Block</span>
            </button>
          )}
        </div>
      </main>

      {viewMode === 'Portfolio' && editingPost && (
        <EditorDrawer 
          post={editingPost} 
          onUpdate={(data) => updatePost(editingPost.id, data)} 
          onClose={() => setEditingPostId(null)}
          onDelete={() => deletePost(editingPost.id)}
        />
      )}
    </div>
  );
};

export default App;
