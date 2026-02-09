
import React, { useState } from 'react';
import { Post } from '../types';
import MediaCarousel from './MediaCarousel';

const InstagramMock: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-100">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-50 p-0.5 border border-slate-100">
            {post.profileImage && <img src={post.profileImage} className="w-full h-full rounded-full object-cover" alt="Profile" />}
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">{post.profileName}</span>
        </div>
        <button className="p-1 text-slate-300 hover:text-slate-500 transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </button>
      </div>
      
      <MediaCarousel media={post.media} />

      <div className="p-5 space-y-4">
        <div className="flex items-center gap-4 text-slate-800">
          <button className="hover:scale-110 transition-transform"><svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></button>
          <button className="hover:scale-110 transition-transform"><svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg></button>
          <button className="hover:scale-110 transition-transform"><svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg></button>
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-extrabold text-slate-900">{post.engagement.likes.toLocaleString()} likes</p>
          <div className="text-sm leading-relaxed text-slate-800">
            <span className="font-extrabold mr-2 text-slate-900">{post.profileName}</span>
            {post.captions.Instagram}
          </div>
          <p className="text-xs font-medium text-slate-400 pt-1 cursor-pointer hover:text-slate-600 transition-colors">View all {post.engagement.comments} comments</p>
        </div>
      </div>
    </div>
  );
};

const FacebookMock: React.FC<{ post: Post }> = ({ post }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const renderMediaPreview = () => {
    if (post.media.length === 0) return <div className="bg-slate-50 aspect-square flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-xs">No Content</div>;
    if (post.media.length === 1) return <img src={post.media[0]} className="w-full aspect-square object-cover" alt="Post content" />;
    
    return (
      <div className="grid grid-cols-2 gap-1 aspect-square cursor-pointer" onClick={() => setModalOpen(true)}>
        <img src={post.media[0]} className="w-full h-full object-cover hover:opacity-90" alt="Preview 1" />
        <div className="relative">
          <img src={post.media[1]} className="w-full h-full object-cover hover:opacity-90" alt="Preview 2" />
          {post.media.length > 2 && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center text-white text-4xl font-black transition-all hover:bg-black/60">
              +{post.media.length - 2}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white border border-slate-100 rounded-[32px] shadow-2xl overflow-hidden ring-1 ring-slate-100">
        <div className="p-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-50 border border-slate-100 p-0.5">
            {post.profileImage && <img src={post.profileImage} className="w-full h-full rounded-full object-cover" alt="Profile" />}
          </div>
          <div className="flex-1">
            <h4 className="text-[16px] font-extrabold text-slate-900 leading-none">{post.profileName}</h4>
            <div className="flex items-center gap-1.5 mt-1.5">
               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Suggested for you</span>
               <span className="text-slate-300">•</span>
               <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm.5 17.5v-3h-1v3a6.5 6.5 0 010-13v3h1v-3a6.5 6.5 0 010 13z"/></svg>
            </div>
          </div>
        </div>

        <div className="px-5 pb-4">
          <p className="text-[15px] leading-relaxed text-slate-800 whitespace-pre-wrap">{post.captions.Facebook}</p>
        </div>

        {renderMediaPreview()}

        <div className="px-5 py-3.5 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
             <div className="flex -space-x-1.5">
               <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[9px] border-2 border-white shadow-sm">👍</div>
               <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[9px] border-2 border-white shadow-sm">❤️</div>
             </div>
             <span className="text-xs font-bold text-slate-400">{post.engagement.likes.toLocaleString()}</span>
          </div>
          <div className="flex gap-3 text-xs font-bold text-slate-400">
            <span>{post.engagement.comments} comments</span>
            <span>{post.engagement.shares} shares</span>
          </div>
        </div>

        <div className="flex items-center h-12 px-2 bg-slate-50/30">
          {[
            { label: 'Like', icon: 'M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3' },
            { label: 'Comment', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
            { label: 'Share', icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' }
          ].map(btn => (
            <button key={btn.label} className="flex-1 flex items-center justify-center gap-2 text-[13px] font-extrabold text-slate-500 hover:bg-white hover:text-indigo-600 rounded-xl h-9 transition-all active:scale-95">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d={btn.icon} strokeLinecap="round" strokeLinejoin="round"></path></svg>
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 sm:p-12">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={() => setModalOpen(false)} />
          <button onClick={() => setModalOpen(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-3 bg-white/5 rounded-full hover:bg-white/10 z-[120]">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <div className="w-full max-w-5xl max-h-full relative z-[115] shadow-2xl animate-scale-in">
            <MediaCarousel media={post.media} aspectRatio="aspect-auto" className="max-h-[85vh] object-contain rounded-2xl overflow-hidden" />
          </div>
        </div>
      )}
    </>
  );
};

const LinkedInMock: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-slate-100">
      <div className="p-4 flex items-start gap-3">
        <div className="w-14 h-14 rounded-lg bg-slate-50 shrink-0 overflow-hidden border border-slate-100 p-0.5">
          {post.profileImage && <img src={post.profileImage} className="w-full h-full rounded-md object-cover" alt="Profile" />}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h4 className="text-sm font-extrabold text-slate-900 truncate">{post.profileName}</h4>
          <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">{post.linkedinJobTitle}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">2w ago</span>
            <span className="text-slate-300">•</span>
            <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm.5 17.5v-3h-1v3a6.5 6.5 0 010-13v3h1v-3a6.5 6.5 0 010 13z"/></svg>
          </div>
        </div>
        <button className="p-1.5 text-slate-300 hover:bg-slate-50 rounded-full transition-all">
           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </button>
      </div>

      <div className="px-4 pb-4">
        <p className="text-[14px] text-slate-800 leading-[1.6] whitespace-pre-wrap">{post.captions.LinkedIn}</p>
      </div>

      <MediaCarousel media={post.media} />

      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
           <div className="flex -space-x-1.5">
             <div className="w-4.5 h-4.5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[7px] border-2 border-white shadow-sm">👍</div>
             <div className="w-4.5 h-4.5 rounded-full bg-green-500 flex items-center justify-center text-white text-[7px] border-2 border-white shadow-sm">💡</div>
           </div>
           <span>{post.engagement.likes.toLocaleString()}</span>
        </div>
        <div className="text-[11px] font-bold text-slate-400 flex gap-1.5 items-center">
          <span>{post.engagement.comments} comments</span>
          <div className="w-1 h-1 rounded-full bg-slate-200" />
          <span>{post.engagement.shares} reposts</span>
        </div>
      </div>

      <div className="flex items-center h-12 px-2">
         {[
           { label: 'Like', icon: 'M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3z' },
           { label: 'Comment', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
           { label: 'Repost', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
           { label: 'Send', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' }
         ].map(btn => (
           <button key={btn.label} className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-black text-slate-500 hover:bg-slate-50 hover:text-indigo-600 rounded-xl h-10 transition-all">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d={btn.icon} strokeLinecap="round" strokeLinejoin="round"></path></svg>
             {btn.label}
           </button>
         ))}
      </div>
    </div>
  );
};

export default {
  Instagram: InstagramMock,
  Facebook: FacebookMock,
  LinkedIn: LinkedInMock
};
