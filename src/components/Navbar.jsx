import React, { useState } from "react";
import { Search, Menu, LogIn, LogOut, Bookmark, Maximize2, Minimize2 } from "lucide-react";
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
  layoutMode,
  onToggleLayout,
}) {
  const { user, openAuthModal, logout, savedTracks } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const isFullscreen = layoutMode === "fullscreen";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <header className="sticky top-0 z-30 bg-[#080706]/85 backdrop-blur-2xl border-b border-white/[0.06] px-4 sm:px-8 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Context Greeting */}
        <div className="flex items-center gap-3">
          {/* Mobile: tombol menu hanya relevan di mode dashboard (sidebar ada) */}
          {layoutMode === "dashboard" && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="lg:hidden p-3 -m-1 rounded-xl bg-[#15120f] border border-white/[0.08] text-stone-300 hover:text-white hover:border-[#d9141f]/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f]"
              aria-label="Buka navigasi sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div>
            <h1 className="font-display text-base sm:text-lg uppercase text-stone-100 tracking-tight flex items-center gap-2">
              Jelajah Musik
              <span className="hidden sm:inline text-xs font-mono font-normal text-stone-400 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.08]">
                Top Chart
              </span>
            </h1>
          </div>
        </div>

        {/* Center/Right: Capsule Search Bar */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-2 sm:mx-4" role="search">
          <div className="relative flex items-center bg-[#15120f] hover:bg-[#1d1915] focus-within:bg-[#1d1915] border border-white/[0.08] focus-within:border-[#d9141f]/50 rounded-full p-2 sm:p-1 pl-4 sm:pl-4 transition-all shadow-lg shadow-black/30 group">
            <Search className="w-4 h-4 text-stone-400 group-focus-within:text-stone-200 shrink-0 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari lagu, artis, atau album..."
              aria-label="Cari lagu atau artis"
              className="w-full bg-transparent text-sm text-stone-100 placeholder-stone-500 px-3 py-2 sm:py-1.5 focus:outline-none"
            />
            {/* Tombol pencarian terpadu */}
            <button
              type="submit"
              className="px-4 py-2 sm:py-1.5 rounded-full bg-gradient-to-r from-[#d9141f] to-[#a01015] hover:from-[#ef2430] hover:to-[#c0121a] text-white font-medium text-xs tracking-wide transition-all shadow-md shadow-[#59060b]/50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f] shrink-0"
              aria-label="Lakukan pencarian musik"
            >
              Search
            </button>
          </div>
        </form>

        {/* Far Right: User Auth Widget */}
        <div className="relative shrink-0 flex items-center gap-2">
          {/* Toggle mode layout: Dashboard (3 zona) <-> Fullscreen (pemilihan lagu) */}
          <button
            type="button"
            onClick={onToggleLayout}
            aria-pressed={isFullscreen}
            aria-label={isFullscreen ? "Beralih ke mode dashboard" : "Beralih ke mode layar penuh"}
            title={isFullscreen ? "Mode dashboard" : "Mode layar penuh"}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-[#15120f] hover:bg-[#1d1915] border border-white/[0.08] hover:border-white/20 text-stone-300 hover:text-white text-xs font-medium transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f]"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden lg:inline">{isFullscreen ? "Dashboard" : "Layar Penuh"}</span>
          </button>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#15120f] hover:bg-[#1d1915] border border-white/[0.08] hover:border-[#d9141f]/30 text-stone-200 text-xs font-medium transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f] shadow-md"
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#d9141f] to-[#a01015] flex items-center justify-center text-white font-bold text-[11px] shadow-sm">
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
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#15120f] border border-white/[0.08] shadow-2xl shadow-black/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                      <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-stone-400 truncate mt-0.5">{user.email}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onOpenSavedTracks) onOpenSavedTracks();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-stone-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left cursor-pointer"
                    >
                      <Bookmark className="w-4 h-4 text-stone-400" />
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
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#d9141f] to-[#a01015] hover:from-[#ef2430] hover:to-[#c0121a] text-white font-semibold text-xs tracking-wide transition-all shadow-lg shadow-[#59060b]/60 border border-[#ef2430]/30 cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f] shrink-0"
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f] ${
                isSelected
                  ? "bg-[#d9141f]/90 text-white shadow-md shadow-[#59060b]/50 border border-[#ef2430]/40"
                  : "bg-[#15120f]/80 hover:bg-[#1d1915] text-stone-400 hover:text-stone-200 border border-white/[0.06]"
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
