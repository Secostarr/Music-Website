import React from "react";
import { Music, Search } from "lucide-react";
import { GENRES } from "../services/audius";

export default function Navbar({
  searchQuery,
  setSearchQuery,
  onSearch,
  selectedGenre,
  onSelectGenre,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/80 px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 self-start md:self-auto cursor-pointer" onClick={() => onSelectGenre("All")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              SoundVibe
              <span className="text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full uppercase">
                Free
              </span>
            </h1>
            <p className="text-xs text-gray-400">Powered by Audius Open API</p>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari lagu, artis, atau album..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900/90 text-sm text-gray-200 placeholder-gray-500 rounded-full pl-10 pr-4 py-2 border border-gray-800 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
          />
        </form>
      </div>

      {/* Genre Pills */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5 mt-2 scrollbar-none no-scrollbar">
        {GENRES.map((genre) => {
          const isActive = selectedGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => onSelectGenre(genre)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-105"
                  : "bg-gray-900/80 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800/80"
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </header>
  );
}
