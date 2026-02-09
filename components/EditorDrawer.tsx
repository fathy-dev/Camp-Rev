
import React, { useState } from 'react';
import { Post, Platform } from '../types';

interface EditorDrawerProps {
  post: Post;
  onUpdate: (data: Partial<Post>) => void;
  onClose: () => void;
  onDelete?: () => void;
}

const EditorDrawer: React.FC<EditorDrawerProps> = ({ post, onUpdate, onClose, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'meta'>('content');

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newUrls = Array.from(files).map((file: File) => URL.createObjectURL(file));
      onUpdate({ media: [...post.media, ...newUrls].slice(0, 10) });
    }
  };

  const removeMedia = (index: number) => {
    onUpdate({ media: post.media.filter((_, i) => i !== index) });
  };

  const moveMedia = (index: number, direction: 'left' | 'right') => {
    const newMedia = [...post.media];
    const target = direction === 'left' ? index - 1 : index + 1;
    if (target >= 0 && target < newMedia.length) {
      [newMedia[index], newMedia[target]] = [newMedia[target], newMedia[index]];
      onUpdate({ media: newMedia });
    }
  };

  const handleProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpdate({ profileImage: URL.createObjectURL(file) });
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-[460px] bg-white h-full shadow-2xl flex flex-col animate-slide-in overflow-hidden border-l border-slate-100">
        <div className="p-8 border-b border-slate-100 bg-white sticky top-0 z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Post Editor</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> CMS Center
            </p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-200">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex px-8 border-b border-slate-50 bg-slate-50/30">
          {(['content', 'media', 'meta'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-12 no-scrollbar">
          {activeTab === 'content' && (
            <div className="space-y-10 animate-fade-in">
              <section className="space-y-6">
                <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">Brand Identity</h3>
                <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="relative group/avatar shrink-0">
                    <div className="w-16 h-16 bg-white rounded-full overflow-hidden shadow-inner border-4 border-white ring-1 ring-slate-100">
                      {post.profileImage ? (
                        <img src={post.profileImage} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                        </div>
                      )}
                      <input type="file" onChange={handleProfileImage} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <input
                      value={post.profileName}
                      onChange={(e) => onUpdate({ profileName: e.target.value })}
                      className="w-full bg-transparent font-black text-slate-900 placeholder-slate-300 focus:outline-none text-lg tracking-tight"
                      placeholder="Display Name"
                    />
                    <input
                      value={post.linkedinJobTitle}
                      onChange={(e) => onUpdate({ linkedinJobTitle: e.target.value })}
                      className="w-full bg-transparent text-xs font-bold text-slate-400 placeholder-slate-300 focus:outline-none uppercase tracking-widest"
                      placeholder="LinkedIn Job Title"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">Platform Copy</h3>
                <div className="space-y-8">
                  {(['Instagram', 'Facebook', 'LinkedIn'] as Platform[]).map(plat => (
                    <div key={plat} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{plat} Caption</span>
                      </div>
                      <textarea
                        value={post.captions[plat]}
                        onChange={(e) => onUpdate({ captions: { ...post.captions, [plat]: e.target.value } })}
                        className="w-full h-32 bg-slate-50 border border-slate-100 rounded-[28px] p-6 text-sm text-slate-700 leading-relaxed resize-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium"
                        placeholder={`Craft the perfect ${plat} narrative...`}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-indigo-700">Campaign Media</h3>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{post.media.length} of 10 slots used</p>
                </div>
                <label className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest cursor-pointer hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">
                  Upload Files
                  <input type="file" multiple accept="image/*,image/gif" onChange={handleMediaUpload} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-5">
                {post.media.map((url, i) => (
                  <div key={i} className="group/media relative aspect-[4/5] bg-slate-50 rounded-[32px] overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:scale-[1.02]">
                    <img src={url} className="w-full h-full object-cover" alt="Campaign item" />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/media:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                      <div className="flex gap-2">
                        <button onClick={() => moveMedia(i, 'left')} className="p-2 bg-white rounded-full text-slate-900 hover:bg-indigo-600 hover:text-white transition-all" title="Move Left">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <button onClick={() => moveMedia(i, 'right')} className="p-2 bg-white rounded-full text-slate-900 hover:bg-indigo-600 hover:text-white transition-all" title="Move Right">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                      </div>
                      <button onClick={() => removeMedia(i)} className="px-5 py-2 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Remove File</button>
                    </div>
                  </div>
                ))}
                {post.media.length === 0 && (
                  <div className="col-span-2 py-20 border-2 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center gap-4 text-slate-300">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <p className="text-[11px] font-black uppercase tracking-widest">No Media Uploaded</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'meta' && (
            <div className="space-y-10 animate-fade-in">
              <section className="space-y-6">
                <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">Visibility Options</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-3xl hover:border-indigo-100 cursor-pointer transition-all group shadow-sm">
                    <input
                      type="checkbox"
                      className="w-6 h-6 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500 transition-all"
                      checked={post.showOnAll}
                      onChange={(e) => onUpdate({ showOnAll: e.target.checked })}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-black text-slate-800 tracking-tight block">Omni-Channel Visibility</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Display on all enabled platforms</span>
                    </div>
                  </label>

                  {!post.showOnAll && (
                    <div className="grid grid-cols-3 gap-3">
                      {(['Instagram', 'Facebook', 'LinkedIn'] as Platform[]).map(plat => (
                        <button
                          key={plat}
                          onClick={() => {
                            const newPlats = post.platforms.includes(plat)
                              ? post.platforms.filter(p => p !== plat)
                              : [...post.platforms, plat];
                            onUpdate({ platforms: newPlats });
                          }}
                          className={`py-3.5 px-2 rounded-2xl text-[10px] font-black border transition-all uppercase tracking-widest ${post.platforms.includes(plat) ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                            }`}
                        >
                          {plat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">Engagement Metrics</h3>
                <div className="grid grid-cols-3 gap-5">
                  {[
                    { label: 'Likes', key: 'likes', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
                    { label: 'Comments', key: 'comments', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
                    { label: 'Shares', key: 'shares', icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' }
                  ].map(stat => (
                    <div key={stat.key} className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d={stat.icon} /></svg>
                        {stat.label}
                      </div>
                      <input
                        type="number"
                        value={post.engagement[stat.key as keyof typeof post.engagement]}
                        onChange={(e) => onUpdate({ engagement: { ...post.engagement, [stat.key]: parseInt(e.target.value) || 0 } })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-black text-slate-900 focus:border-indigo-500 focus:bg-white transition-all outline-none shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-slate-100 bg-white flex items-center gap-4 sticky bottom-0">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl active:scale-95"
          >
            Finished Editing
          </button>
          <button
            onClick={onDelete}
            className={`p-4 bg-red-50 text-red-500 rounded-[24px] hover:bg-red-100 transition-all border border-red-100 ${!onDelete ? 'hidden' : ''}`}
            title="Delete Permanently"
            disabled={!onDelete}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorDrawer;
