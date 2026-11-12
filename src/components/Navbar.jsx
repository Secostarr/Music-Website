import React, { useState } from "react";
import { Search, Menu, User, LogIn, LogOut, Bookmark } from "lucide-react";
import { GENRE_PRESETS } from "../services/musicApi";
import { useAuth } from "../context/AuthContext";

export default function Navbar({
  searchQuery,
  setSearchQuery,
  onSearch,
  selectedCategory,
  onSelectCategory,
  onOpenMobileMenu,
  onOpenSavedTracks,
}) {
  const { user, openAuthModal, logout, savedTracks } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <header className="sticky top-0 z-30 bg-[#060907]/85 backdrop-blur-2xl border-b border-white/[0.06] px-4 sm:px-8 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Context Greeting */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-[#0f1713] border border-white/[0.08] text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Buka navigasi sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
              Jelajah Musik
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="hidden sm:inline text-xs font-mono font-normal text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Top Chart
              </span>
            </h1>
          </div>
        </div>

        {/* Center/Right: Capsule Search Bar */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-2 sm:mx-4" role="search">
          <div className="relative flex items-center bg-[#0f1713] hover:bg-[#14201a] focus-within:bg-[#14201a] border border-white/[0.08] focus-within:border-emerald-500/50 rounded-full p-1 pl-4 transition-all shadow-lg shadow-black/30 group">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-400 shrink-0 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari lagu, artis, atau album..."
              aria-label="Cari lagu atau artis"
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 px-3 py-1.5 focus:outline-none"
            />
            {/* Integrated Emerald Action Button */}
            <button
              type="submit"
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-xs tracking-wide transition-all shadow-md shadow-emerald-950/50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 shrink-0"
              aria-label="Lakukan pencarian musik"
            >
              Search
            </button>
          </div>
        </form>

        {/* Far Right: User Auth Widget */}
        <div className="relative shrink-0 flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#0f1713] hover:bg-[#14201a] border border-white/[0.08] hover:border-emerald-500/30 text-slate-200 text-xs font-medium transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 shadow-md"
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-[11px] shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="max-w-[100px] truncate hidden sm:inline">{user.name || "Akun"}</span>
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0f1713] border border-white/[0.08] shadow-2xl shadow-black/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                      <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onOpenSavedTracks) onOpenSavedTracks();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left cursor-pointer"
                    >
                      <Bookmark className="w-4 h-4 text-emerald-400" />
                      <span>Lagu Tersimpan ({savedTracks.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors text-left cursor-pointer mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs tracking-wide transition-all shadow-lg shadow-emerald-950/60 border border-emerald-400/30 cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 shrink-0"
              aria-label="Masuk ke akun"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Genre Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-0.5 no-scrollbar">
        {GENRE_PRESETS.map((category) => {
          const isSelected = selectedCategory.name === category.name;
          return (
            <button
              key={category.name}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isSelected
                  ? "bg-emerald-500/90 text-white shadow-md shadow-emerald-950/50 border border-emerald-400/40"
                  : "bg-[#0f1713]/80 hover:bg-[#14201a] text-slate-400 hover:text-slate-200 border border-white/[0.06]"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </header>
  );
}
