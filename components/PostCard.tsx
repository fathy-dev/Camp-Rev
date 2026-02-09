
import React, { useState, useEffect } from 'react';
import { Post, ViewMode, Platform } from '../types';
import PlatformMocks from './PlatformMocks';

interface PostCardProps {
  post: Post;
  viewMode: ViewMode;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, viewMode, isEditing, onEdit, onDelete, onDuplicate }) => {
  const platformsToShow = post.showOnAll ? (['Instagram', 'Facebook', 'LinkedIn'] as Platform[]) : post.platforms;
  const [activeTab, setActiveTab] = useState<Platform>(platformsToShow[0] || 'Instagram');

  useEffect(() => {
    if (!platformsToShow.includes(activeTab) && platformsToShow.length > 0) {
      setActiveTab(platformsToShow[0]);
    }
  }, [platformsToShow, activeTab]);

  return (
    <div className={`group relative bg-white rounded-[56px] shadow-sm border border-slate-100 overflow-hidden transition-all duration-700 ${isEditing ? 'ring-[6px] ring-indigo-600/10 shadow-2xl scale-[1.01]' : 'hover:shadow-xl'}`}>
      
      {viewMode === 'Portfolio' && (
        <div className="absolute top-10 right-10 z-20 flex gap-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
          <button 
            onClick={onDuplicate} 
            className="w-12 h-12 bg-white/95 backdrop-blur-xl border border-slate-100 text-slate-600 rounded-[18px] hover:bg-white hover:text-indigo-600 shadow-2xl flex items-center justify-center transition-all hover:-translate-y-0.5"
            title="Clone Block"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
          </button>
          <button 
            onClick={onEdit} 
            className="px-8 bg-indigo-600 text-white rounded-[18px] font-black text-xs tracking-widest uppercase shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            Configure Block
          </button>
          <button 
            onClick={onDelete} 
            className="w-12 h-12 bg-white/95 backdrop-blur-xl border border-slate-100 text-slate-300 rounded-[18px] hover:text-red-500 shadow-2xl flex items-center justify-center transition-all hover:-translate-y-0.5"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      )}

      {platformsToShow.length > 1 && (
        <div className="flex px-12 border-b border-slate-50 bg-[#FCFDFF]">
          {platformsToShow.map((plat) => (
            <button
              key={plat}
              onClick={() => setActiveTab(plat)}
              className={`relative py-7 px-8 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                activeTab === plat 
                ? 'text-indigo-600' 
                : 'text-slate-300 hover:text-slate-500'
              }`}
            >
              {plat} Preview
              {activeTab === plat && (
                <div className="absolute bottom-0 left-8 right-8 h-1 bg-indigo-600 rounded-t-full animate-tab-in" />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="p-12 md:p-20 flex items-center justify-center bg-white min-h-[700px]">
        <div className="w-full max-w-[480px]">
           <div className="animate-fade-in">
             {activeTab === 'Instagram' && <PlatformMocks.Instagram post={post} />}
             {activeTab === 'Facebook' && <PlatformMocks.Facebook post={post} />}
             {activeTab === 'LinkedIn' && <PlatformMocks.LinkedIn post={post} />}
           </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
