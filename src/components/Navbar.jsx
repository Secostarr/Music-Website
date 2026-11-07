import React from "react";
import { Music, Search } from "lucide-react";
import { GENRE_PRESETS } from "../services/musicApi";

export default function Navbar({
  searchQuery,
  setSearchQuery,
  onSearch,
  selectedCategory,
  onSelectCategory,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#050608]/80 backdrop-blur-xl border-b border-white/[0.07] px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div
          className="flex items-center gap-3 self-start md:self-auto cursor-pointer group"
          onClick={() => onSelectCategory(GENRE_PRESETS[0])}
        >
          <div className="w-10 h-10 rounded-xl bg-[#141724] border border-white/[0.08] flex items-center justify-center shadow-lg shadow-black/40 group-hover:border-purple-500/40 group-hover:shadow-purple-950/30 transition-all duration-300">
            <Music className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              SoundVibe
              <span className="text-[10px] font-mono tracking-wider font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full uppercase">
                Official Hits
              </span>
            </h1>
            <p className="text-xs text-slate-400">Mainstream Top Charts & Curated Audio</p>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} role="search" aria-label="Pencarian lagu" className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari lagu (contoh: Bernadya, Taylor Swift, Hindia)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Cari judul lagu atau nama artis"
            className="w-full bg-[#0f111a]/90 text-sm text-slate-200 placeholder-slate-500 rounded-full pl-10 pr-4 py-2 border border-white/[0.08] focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50 focus:bg-[#141724] transition-all shadow-inner"
          />
        </form>
      </div>

      {/* Categories / Genres */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5 mt-2 scrollbar-none no-scrollbar">
        {GENRE_PRESETS.map((item) => {
          const isActive = selectedCategory?.name === item.name;
          return (
            <button
              key={item.name}
              onClick={() => onSelectCategory(item)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-purple-600/90 text-white shadow-md shadow-purple-950/50 border border-purple-400/40"
                  : "bg-[#0f111a]/80 text-slate-400 hover:text-slate-200 hover:bg-[#141724] border border-white/[0.06]"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </header>
  );
}
