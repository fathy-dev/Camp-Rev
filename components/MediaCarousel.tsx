
import React, { useState } from 'react';

interface MediaCarouselProps {
  media: string[];
  aspectRatio?: string;
  className?: string;
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({ media, aspectRatio = "aspect-4-5", className = "" }) => {
  const [index, setIndex] = useState(0);

  if (media.length === 0) {
    return (
      <div className={`bg-slate-50 flex items-center justify-center ${aspectRatio} ${className} border-y border-slate-100`}>
        <div className="flex flex-col items-center gap-2 opacity-20">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <p className="text-xs font-black uppercase tracking-widest">Media Required</p>
        </div>
      </div>
    );
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    <div className={`relative overflow-hidden group/carousel ${aspectRatio} ${className} bg-slate-100`}>
      <div className="absolute inset-0 flex transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1)" style={{ transform: `translateX(-${index * 100}%)` }}>
        {media.map((url, i) => (
          <img key={i} src={url} className="w-full h-full object-cover shrink-0 select-none" alt={`Slide ${i + 1}`} />
        ))}
      </div>

      {media.length > 1 && (
        <>
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 flex justify-between pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
            <button 
              onClick={handlePrev} 
              className="pointer-events-auto w-10 h-10 rounded-full glass-panel text-slate-800 flex items-center justify-center shadow-2xl hover:bg-white hover:scale-110 active:scale-95 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button 
              onClick={handleNext} 
              className="pointer-events-auto w-10 h-10 rounded-full glass-panel text-slate-800 flex items-center justify-center shadow-2xl hover:bg-white hover:scale-110 active:scale-95 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>

          <div className="absolute top-4 right-4 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-black text-white/90 uppercase tracking-widest shadow-lg">
            {index + 1} / {media.length}
          </div>

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 pointer-events-none">
            {media.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${index === i ? 'bg-white w-6' : 'bg-white/40 w-1.5'}`} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MediaCarousel;
