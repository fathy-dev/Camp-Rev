import React, { useState, useCallback, useEffect } from 'react';
import { ViewMode, Post } from './types';
import Header from './components/Header';
import CampaignHero from './components/CampaignHero';
import PostCard from './components/PostCard';
import EditorDrawer from './components/EditorDrawer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './components/AuthContext';
import { CampaignProvider, useCampaign } from './components/CampaignContext';
import CampaignList from './components/CampaignList';
import ShareModal from './components/ShareModal';

const CampaignApp: React.FC = () => {
  const {
    campaigns,
    activeCampaign,
    setActiveCampaignId,
    updateCampaign,
    importCampaigns,
    canEdit,
    canDelete,
    canShare,
    isSharedAccess
  } = useCampaign();

  const [viewMode, setViewMode] = useState<ViewMode>('Portfolio');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Force Approval mode for shared viewers (unless they have edit permission - handled via context but viewMode can force UI)
  const effectiveViewMode = !canEdit ? 'Approval' : viewMode;

  // Effects
  useEffect(() => {
    if (activeCampaign) {
      setSaveStatus('saving');
      const timer = setTimeout(() => setSaveStatus('saved'), 600);
      return () => clearTimeout(timer);
    }
  }, [activeCampaign]);

  const editingPost = activeCampaign?.posts.find(p => p.id === editingPostId);

  // Handlers
  const exportWorkspace = useCallback(() => {
    const dataStr = JSON.stringify(campaigns, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
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
          importCampaigns(json);
          alert('Workspace imported successfully.');
        }
      } catch (err) {
        alert('Failed to parse workspace file. Ensure it is a valid CampaignFlow JSON.');
      }
    };
    reader.readAsText(file);
  }, [importCampaigns]);

  const duplicateCampaign = useCallback(() => {
    if (!activeCampaign) return;
    // Note: Creating a "true" duplicate including owner requires context, 
    // but typically duplicate is "create new as me based on this". 
    // For simplicity, we assume Dashboard handles main creations, 
    // but if we want "Duplicate" here, we'd need a `createCampaign` that accepts full object.
    // Given the constraints and UI, we might skip "Duplicate Campaign" button inside the view 
    // or implement it later. The CampaignHero had a duplicate prop.
    // Let's implement a simple version if needed, or remove it.
    alert("Please use the 'Create Campaign' feature in the dashboard to start new campaigns.");
  }, [activeCampaign]);

  const addPost = useCallback(() => {
    if (!activeCampaign || !canEdit) return;
    const newPost: Post = {
      id: `p-${Date.now()}`,
      profileName: 'Brand Account',
      profileImage: null,
      linkedinJobTitle: 'Official Brand Page',
      media: [],
      captions: {
        Instagram: 'New content placeholder...',
        Facebook: 'New content placeholder...',
        LinkedIn: 'New content placeholder...'
      },
      engagement: { likes: 0, comments: 0, shares: 0 },
      platforms: ['Instagram'],
      showOnAll: true
    };
    updateCampaign(activeCampaign.id, {
      posts: [...activeCampaign.posts, newPost]
    });
    setEditingPostId(newPost.id);
  }, [activeCampaign, updateCampaign, canEdit]);

  const deletePost = useCallback((postId: string) => {
    if (!activeCampaign || !canEdit) return;
    if (confirm('Permanently remove this post block?')) {
      updateCampaign(activeCampaign.id, {
        posts: activeCampaign.posts.filter(p => p.id !== postId)
      });
      if (editingPostId === postId) setEditingPostId(null);
    }
  }, [activeCampaign, updateCampaign, editingPostId, canEdit]);

  const updatePost = useCallback((postId: string, data: Partial<Post>) => {
    if (!activeCampaign) return;
    updateCampaign(activeCampaign.id, {
      posts: activeCampaign.posts.map(p => p.id === postId ? { ...p, ...data } : p)
    });
  }, [activeCampaign, updateCampaign]);

  const duplicatePost = useCallback((post: Post) => {
    if (!activeCampaign || !canEdit) return;
    const newPost = { ...post, id: `p-${Date.now()}` };
    updateCampaign(activeCampaign.id, {
      posts: [...activeCampaign.posts, newPost]
    });
    setEditingPostId(newPost.id);
  }, [activeCampaign, updateCampaign, canEdit]);


  if (!activeCampaign) {
    return <CampaignList />;
  }

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-500 ${effectiveViewMode === 'Approval' ? 'bg-white' : 'bg-[#F9FAFB]'}`}>
      <Header
        viewMode={effectiveViewMode}
        setViewMode={canEdit ? setViewMode : () => { }}
        activeCampaign={activeCampaign}
        onBack={() => setActiveCampaignId(null)}
        onShare={() => setIsShareModalOpen(true)}
        onExport={exportWorkspace}
        onImport={importWorkspace}
        saveStatus={saveStatus}
        canCreateCampaign={false} // Handled in Dashboard
        canImportExport={true}
        canShare={canShare}
      />

      <main className="max-w-[900px] mx-auto px-6 mt-12 space-y-20">
        <CampaignHero
          campaign={activeCampaign}
          updateCampaign={(updated) => updateCampaign(updated.id, updated)}
          viewMode={effectiveViewMode}
          onDuplicate={undefined} // Removed duplicate from Hero for simplicity or add back if critical
        />

        <div className="space-y-16 pb-20">
          {activeCampaign.posts.length > 0 ? (
            activeCampaign.posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                viewMode={effectiveViewMode}
                isEditing={editingPostId === post.id}
                onEdit={canEdit ? () => setEditingPostId(post.id) : undefined}
                onDelete={canEdit ? () => deletePost(post.id) : undefined}
                onDuplicate={canEdit ? () => duplicatePost(post) : undefined}
              />
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Campaign is Empty</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-xs">Your campaign has no social posts yet. Switch to Portfolio Mode to begin building.</p>
              {effectiveViewMode === 'Portfolio' && canEdit && (
                <button onClick={addPost} className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">Create First Post</button>
              )}
            </div>
          )}

          {effectiveViewMode === 'Portfolio' && canEdit && (
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

      {effectiveViewMode === 'Portfolio' && editingPost && canEdit && (
        <EditorDrawer
          post={editingPost}
          onUpdate={(data) => updatePost(editingPost.id, data)}
          onClose={() => setEditingPostId(null)}
          onDelete={canEdit ? () => deletePost(editingPost.id) : undefined}
        />
      )}

      {isShareModalOpen && (
        <ShareModal
          campaignId={activeCampaign.id}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CampaignProvider>
        <ProtectedRoute>
          <CampaignApp />
        </ProtectedRoute>
      </CampaignProvider>
    </AuthProvider>
  );
};

export default App;
