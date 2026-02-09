
import React from 'react';
import { Campaign, ViewMode } from '../types';

interface CampaignHeroProps {
  campaign: Campaign;
  updateCampaign: (campaign: Campaign) => void;
  viewMode: ViewMode;
  onDuplicate: () => void;
}

const CampaignHero: React.FC<CampaignHeroProps> = ({ campaign, updateCampaign, viewMode, onDuplicate }) => {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateCampaign({ ...campaign, logo: url });
    }
  };

  if (viewMode === 'Approval') {
    return (
      <section className="bg-white px-8 py-20 md:px-24 md:py-32 rounded-[64px] shadow-sm border border-slate-50 text-center space-y-12 animate-fade-in">
        {campaign.logo ? (
          <img src={campaign.logo} alt="Logo" className="w-28 h-28 mx-auto rounded-[32px] object-cover shadow-2xl border-4 border-white ring-1 ring-slate-100" />
        ) : (
          <div className="w-24 h-24 bg-slate-50 rounded-[32px] mx-auto flex items-center justify-center text-slate-200 border border-slate-100">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
        )}
        <div className="space-y-6">
          <p className="text-indigo-600 font-black tracking-[0.4em] uppercase text-[11px]">{campaign.date}</p>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.95]">{campaign.name}</h1>
          <p className="text-2xl md:text-3xl text-slate-400 font-bold max-w-2xl mx-auto tracking-tight">{campaign.subtitle}</p>
        </div>
        <div className="h-px w-24 bg-slate-100 mx-auto" />
        <p className="max-w-2xl mx-auto text-slate-400 leading-relaxed text-xl font-medium antialiased">{campaign.description}</p>
      </section>
    );
  }

  return (
    <section className="bg-white p-12 md:p-16 rounded-[48px] shadow-sm border border-slate-100 space-y-12 relative group overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-12 relative z-10">
        <div className="relative group/logo shrink-0">
          <div className="w-48 h-48 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-500 shadow-inner">
            {campaign.logo ? (
              <img src={campaign.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-300">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-[10px] font-black uppercase tracking-widest">Brand Logo</span>
              </div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
        </div>

        <div className="flex-1 w-full space-y-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-300 uppercase tracking-widest px-1">Campaign Title</label>
            <input
              value={campaign.name}
              onChange={(e) => updateCampaign({ ...campaign, name: e.target.value })}
              className="w-full text-5xl font-black text-slate-900 focus:outline-none placeholder-slate-200 bg-transparent tracking-tighter"
              placeholder="Campaign Title"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-indigo-300 uppercase tracking-widest px-1">Strategic Subtitle</label>
            <input
              value={campaign.subtitle}
              onChange={(e) => updateCampaign({ ...campaign, subtitle: e.target.value })}
              className="w-full text-2xl text-indigo-600 font-black focus:outline-none placeholder-indigo-100 bg-transparent tracking-tight"
              placeholder="Campaign Theme / Slogan"
            />
          </div>
          <div className="flex flex-wrap items-center gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-300 uppercase tracking-widest px-1">Project Period</label>
              <input
                type="text"
                value={campaign.date}
                onChange={(e) => updateCampaign({ ...campaign, date: e.target.value })}
                className="focus:outline-none text-base font-bold text-slate-600 border-b border-transparent focus:border-slate-300 bg-transparent w-40"
                placeholder="Launch Date"
              />
            </div>
            <button 
              onClick={onDuplicate}
              className="mt-auto px-6 py-3 bg-white border border-slate-100 shadow-xl shadow-slate-100 hover:bg-slate-900 hover:text-white text-slate-900 rounded-[20px] text-[11px] font-black uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
              Clone Campaign
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <label className="text-[11px] font-black text-slate-300 uppercase tracking-widest px-1">Campaign Manifesto & Strategy</label>
        <textarea
          value={campaign.description}
          onChange={(e) => updateCampaign({ ...campaign, description: e.target.value })}
          className="w-full h-40 text-slate-500 leading-relaxed resize-none focus:outline-none bg-slate-50 border border-slate-100 p-8 rounded-[36px] hover:border-slate-200 focus:border-indigo-200 focus:bg-white transition-all font-medium text-lg antialiased"
          placeholder="Articulate the vision behind this campaign..."
        />
      </div>
    </section>
  );
};

export default CampaignHero;
