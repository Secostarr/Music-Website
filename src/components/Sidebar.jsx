import React from "react";
import {
  Music,
  Compass,
  TrendingUp,
  Sparkles,
  Flame,
  Radio,
  Disc3,
  X,
} from "lucide-react";
import { GENRE_PRESETS } from "../services/musicApi";

export default function Sidebar({
  activeTab,
  onTabChange,
  selectedCategory,
  onSelectCategory,
  isOpenMobile,
  onCloseMobile,
}) {
  const handleNavClick = (tab, category = null) => {
    onTabChange(tab);
    if (category) {
      onSelectCategory(category);
    }
    if (isOpenMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          aria-hidden="true"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-[#060907]/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        aria-label="Navigasi Utama"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 xl:w-72 bg-[#0a0f0d]/95 backdrop-blur-2xl border-r border-white/[0.07] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0 shadow-2xl shadow-emerald-950/40" : "-translate-x-full"
        }`}
      >
        {/* Top Brand & Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto px-4 py-5 scrollbar-thin">
          {/* Header Brand */}
          <div className="flex items-center justify-between px-2 mb-8">
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleNavClick("music", GENRE_PRESETS[0])}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNavClick("music", GENRE_PRESETS[0]);
                }
              }}
              className="flex items-center gap-3 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/60 border border-emerald-400/30 group-hover:scale-105 transition-transform">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-black tracking-wider text-white flex items-center gap-1">
                  IRAMA<span className="text-emerald-400">NUSANTARA</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono tracking-widest block uppercase">
                  Musik Indonesia
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Tutup menu navigasi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Menu Section */}
          <div className="space-y-1 mb-8">
            <div className="px-3 mb-2 text-[11px] font-mono font-semibold tracking-wider uppercase text-slate-500">
              Menu Utama
            </div>

            <button
              type="button"
              onClick={() => handleNavClick("music", GENRE_PRESETS[0])}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activeTab === "music" && selectedCategory.name === GENRE_PRESETS[0].name
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950/40"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Hits Indonesia</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick("music", GENRE_PRESETS[1])}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activeTab === "music" && selectedCategory.name === GENRE_PRESETS[1].name
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950/40"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Dangdut & Koplo</span>
            </button>

            {/* Reff Viral Tab Entry */}
            <button
              type="button"
              onClick={() => handleNavClick("viral")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activeTab === "viral"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950/40"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span>Reff Viral</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Quotes
              </span>
            </button>
          </div>

          {/* Discover by Genre */}
          <div className="space-y-1 mb-8">
            <div className="px-3 mb-2 text-[11px] font-mono font-semibold tracking-wider uppercase text-slate-500">
              Kategori Genre
            </div>
            {GENRE_PRESETS.slice(2).map((genre) => {
              const isSelected = activeTab === "music" && selectedCategory.name === genre.name;
              return (
                <button
                  key={genre.name}
                  type="button"
                  onClick={() => handleNavClick("music", genre)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    isSelected
                      ? "bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                  }`}
                >
                  <Disc3 className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-400" : "text-slate-500"}`} />
                  <span className="truncate">{genre.name}</span>
                </button>
              );
            })}
          </div>

          {/* Library Section */}
          <div className="space-y-1">
            <div className="px-3 mb-2 text-[11px] font-mono font-semibold tracking-wider uppercase text-slate-500">
              Koleksi Suara
            </div>
            <button
              type="button"
              onClick={() => handleNavClick("music", GENRE_PRESETS[8])}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activeTab === "music" && selectedCategory.name === GENRE_PRESETS[8].name
                  ? "bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
              }`}
            >
              <Disc3 className="w-3.5 h-3.5 text-slate-500" />
              <span>{GENRE_PRESETS[8].name}</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("music", GENRE_PRESETS[9])}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activeTab === "music" && selectedCategory.name === GENRE_PRESETS[9].name
                  ? "bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-500" />
              <span>{GENRE_PRESETS[9].name}</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer Badge */}
        <div className="p-4 border-t border-white/[0.06] bg-[#060907]/50">
          <div className="p-3 rounded-2xl bg-[#0f1713] border border-white/[0.06] flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">Audiophile Studio</p>
              <p className="text-[10px] text-slate-500 font-mono">Audio Engine</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
