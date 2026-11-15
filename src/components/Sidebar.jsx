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
          className="fixed inset-0 bg-[#080706]/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        aria-label="Navigasi Utama"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 xl:w-72 bg-[#0b0a09]/95 border-r border-white/[0.07] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0 shadow-2xl shadow-[#59060b]/40" : "-translate-x-full"
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
              className="flex items-center gap-3 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f] rounded-xl p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d9141f] to-[#8b0e14] flex items-center justify-center shadow-lg shadow-[#59060b]/60 border border-[#ef2430]/30 group-hover:scale-105 transition-transform">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display text-lg tracking-tight text-white flex items-center gap-1">
                  IRAMA<span className="text-[#ef2430]">NUSANTARA</span>
                </span>
                <span className="text-[10px] text-stone-500 font-mono tracking-widest block uppercase">
                  Musik Indonesia
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-3 -m-1 text-stone-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f]"
              aria-label="Tutup menu navigasi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Menu Section */}
          <div className="space-y-1 mb-8">
            <div className="px-3 mb-2 text-[11px] font-mono font-semibold tracking-wider uppercase text-stone-500">
              Menu Utama
            </div>

            <button
              type="button"
              onClick={() => handleNavClick("music", GENRE_PRESETS[0])}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f] ${
                activeTab === "music" && selectedCategory.name === GENRE_PRESETS[0].name
                  ? "bg-[#d9141f]/15 text-[#f44551] border border-[#d9141f]/30 shadow-sm shadow-[#59060b]/40"
                  : "text-stone-400 hover:text-stone-100 hover:bg-white/[0.04]"
              }`}
            >
              <TrendingUp className="w-4 h-4 text-stone-400" />
              <span>Hits Indonesia</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick("music", GENRE_PRESETS[1])}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f] ${
                activeTab === "music" && selectedCategory.name === GENRE_PRESETS[1].name
                  ? "bg-[#d9141f]/15 text-[#f44551] border border-[#d9141f]/30 shadow-sm shadow-[#59060b]/40"
                  : "text-stone-400 hover:text-stone-100 hover:bg-white/[0.04]"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Dangdut & Koplo</span>
            </button>

            {/* Reff Viral Tab Entry */}
            <button
              type="button"
              onClick={() => handleNavClick("viral")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f] ${
                activeTab === "viral"
                  ? "bg-[#d9141f]/15 text-[#f44551] border border-[#d9141f]/30 shadow-sm shadow-[#59060b]/40"
                  : "text-stone-400 hover:text-stone-100 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Flame className="w-4 h-4 text-stone-500" />
                <span>Reff Viral</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-stone-400 border border-white/[0.06]">
                Quotes
              </span>
            </button>
          </div>

          {/* Discover by Genre */}
          <div className="space-y-1 mb-8">
            <div className="px-3 mb-2 text-[11px] font-mono font-semibold tracking-wider uppercase text-stone-500">
              Kategori Genre
            </div>
            {GENRE_PRESETS.slice(2).map((genre) => {
              const isSelected = activeTab === "music" && selectedCategory.name === genre.name;
              return (
                <button
                  key={genre.name}
                  type="button"
                  onClick={() => handleNavClick("music", genre)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f] ${
                    isSelected
                      ? "bg-[#d9141f]/15 text-[#f44551] font-semibold border border-[#d9141f]/30"
                      : "text-stone-400 hover:text-stone-200 hover:bg-white/[0.03]"
                  }`}
                >
                  <Disc3 className={`w-3.5 h-3.5 ${isSelected ? "text-[#ef2430]" : "text-stone-500"}`} />
                  <span className="truncate">{genre.name}</span>
                </button>
              );
            })}
          </div>

          {/* Library Section */}
          <div className="space-y-1">
            <div className="px-3 mb-2 text-[11px] font-mono font-semibold tracking-wider uppercase text-stone-500">
              Koleksi Suara
            </div>
            <button
              type="button"
              onClick={() => handleNavClick("music", GENRE_PRESETS[8])}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f] ${
                activeTab === "music" && selectedCategory.name === GENRE_PRESETS[8].name
                  ? "bg-[#d9141f]/15 text-[#f44551] font-semibold border border-[#d9141f]/30"
                  : "text-stone-400 hover:text-stone-200 hover:bg-white/[0.03]"
              }`}
            >
              <Disc3 className="w-3.5 h-3.5 text-stone-500" />
              <span>{GENRE_PRESETS[8].name}</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("music", GENRE_PRESETS[9])}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f] ${
                activeTab === "music" && selectedCategory.name === GENRE_PRESETS[9].name
                  ? "bg-[#d9141f]/15 text-[#f44551] font-semibold border border-[#d9141f]/30"
                  : "text-stone-400 hover:text-stone-200 hover:bg-white/[0.03]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-500" />
              <span>{GENRE_PRESETS[9].name}</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer Badge */}
        <div className="p-4 border-t border-white/[0.06] bg-[#080706]/50">
          <div className="p-3 rounded-2xl bg-[#15120f] border border-white/[0.06] flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4 text-stone-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-stone-200 truncate">Audiophile Studio</p>
              <p className="text-[10px] text-stone-500 font-mono">Audio Engine</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
