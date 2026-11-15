import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import RightPanel from "./components/RightPanel";
import TrackCard from "./components/TrackCard";
import Player from "./components/Player";
import ViewTabs from "./components/ViewTabs";
import ViralSoundsView from "./components/ViralSoundsView";
import AuthModal from "./components/AuthModal";
import SavedTracksPanel from "./components/SavedTracksPanel";
import { fetchTopCharts, searchTracks, GENRE_PRESETS } from "./services/musicApi";
import { useAudio } from "./context/AudioContext";
import { useAuth } from "./context/AuthContext";
import { TrendingUp, Music2, AlertCircle } from "lucide-react";
import SongCoverflow from "./components/SongCoverflow";

export default function App() {
  const [activeTab, setActiveTab] = useState("music"); // 'music' | 'viral'
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(GENRE_PRESETS[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedPanelOpen, setSavedPanelOpen] = useState(false);
  // Mode layout: 'dashboard' (3 zona) | 'fullscreen' (pemilihan lagu layar penuh)
  const [layoutMode, setLayoutMode] = useState(() => {
    try {
      return localStorage.getItem("irama_layout") === "fullscreen" ? "fullscreen" : "dashboard";
    } catch {
      return "dashboard";
    }
  });
  const searchRequestIdRef = React.useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem("irama_layout", layoutMode);
    } catch {
      // Storage tidak tersedia: mode tetap berlaku selama sesi.
    }
  }, [layoutMode]);

  // Audio Context Engine
  const { currentTrack, isPlaying, playTrack, togglePlay, setPlaylist } = useAudio();
  const { authError, clearAuthError } = useAuth();

  const loadCategoryTracks = useCallback(
    async (category) => {
      const requestId = ++searchRequestIdRef.current;
      setLoading(true);
      setError(null);
      try {
        let data = [];
        if (!category.query) {
          data = await fetchTopCharts();
        } else {
          data = await searchTracks(category.query);
        }
        if (requestId !== searchRequestIdRef.current) return;
        setTracks(data);
        if (activeTab === "music") {
          setPlaylist(data);
        }
      } catch (err) {
        if (requestId !== searchRequestIdRef.current) return;
        console.warn("Gagal memuat katalog lagu:", err);
        setError("Gagal memuat lagu. Coba pilih kategori lain atau periksa koneksi internet.");
      } finally {
        if (requestId === searchRequestIdRef.current) setLoading(false);
      }
    },
    [activeTab, setPlaylist]
  );

  // Load tracks when category changes
  useEffect(() => {
    loadCategoryTracks(selectedCategory);
  }, [selectedCategory, loadCategoryTracks]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadCategoryTracks(selectedCategory);
      return;
    }
    // Pencarian bersifat universal: otomatis beralih ke tab musik untuk menampilkan hasil
    const requestId = ++searchRequestIdRef.current;
    setActiveTab("music");
    setLoading(true);
    setError(null);
    try {
      const results = await searchTracks(searchQuery);
      if (requestId !== searchRequestIdRef.current) return;
      setTracks(results);
      setPlaylist(results);
    } catch (err) {
      if (requestId !== searchRequestIdRef.current) return;
      console.warn("Gagal melakukan pencarian lagu:", err);
      setError("Gagal melakukan pencarian lagu.");
    } finally {
      if (requestId === searchRequestIdRef.current) setLoading(false);
    }
  };

  const handlePlayTrack = (track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, tracks);
    }
  };

  const featuredTrack = tracks[0];

  return (
    <div className="min-h-screen bg-[#0b0a09] text-stone-100 flex flex-col">
      {/* 3-Zone Architecture: Left Sidebar */}
      {layoutMode === "dashboard" && (
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === "music" && tracks.length > 0) {
              setPlaylist(tracks);
            }
          }}
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => {
            setSelectedCategory(category);
            setSearchQuery("");
            setActiveTab("music");
          }}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Layout Container: Offset from Left Sidebar on Desktop */}
      <div className={`flex-1 flex flex-col transition-all ${layoutMode === "dashboard" ? "lg:pl-64 xl:pl-72" : ""}`}>
        {/* Top Navbar */}
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => {
            setSelectedCategory(category);
            setSearchQuery("");
            setActiveTab("music");
          }}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenSavedTracks={() => setSavedPanelOpen(true)}
          layoutMode={layoutMode}
          onToggleLayout={() => setLayoutMode(layoutMode === "dashboard" ? "fullscreen" : "dashboard")}
        />

        {/* Center Content + Right Panel Wrapper */}
        <div className="flex-1 flex w-full pb-40 md:pb-32">
          {/* Main Content Area */}
          <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 w-full">
            {/* Navigasi Tab Utama */}
            <div className="mb-6">
              <ViewTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* Tab Reff Viral */}
            {activeTab === "viral" && <ViralSoundsView />}

            {/* Tab Katalog Musik Populer */}
            {activeTab === "music" && (
              <section id="panel-music" role="tabpanel" aria-labelledby="tab-music">
                {/* Hero ala lolawilde: judul poster + karosel 3D lagu hits (geser/drag) */}
                {featuredTrack && !loading && (
                  <section className="relative -mx-4 sm:-mx-8 px-4 sm:px-8 pt-2 pb-8 overflow-hidden" aria-label="Lagu populer saat ini">
                    <div
                      aria-hidden="true"
                      className="absolute left-1/2 bottom-[-18vh] w-[120vw] h-[70vh] -translate-x-1/2 pointer-events-none"
                      style={{ background: "radial-gradient(ellipse at center, rgba(200,130,58,.16), transparent 62%)" }}
                    />
                    <div className="relative z-10 text-center">
                      <h1 className="font-display uppercase leading-[0.9] tracking-tight">
                        <span className="block text-[#d9141f] text-[clamp(2.2rem,6vw,4.6rem)]">Lagu Hits</span>
                        <span className="block text-[clamp(0.95rem,1.8vw,1.4rem)] mt-1">IramaNusantara</span>
                      </h1>
                      <p className="inline-flex items-center gap-2.5 mt-4 text-[13px] text-[rgba(243,238,231,.66)]">
                        <span className="w-[7px] h-[7px] rounded-full bg-stone-500" />
                        <span><b className="text-[#f3eee7] font-semibold">Sedang tren</b> — {tracks.length} lagu terpopuler minggu ini</span>
                      </p>
                    </div>
                    <div className="relative z-10 mt-2">
                      <SongCoverflow
                        tracks={tracks}
                        onPlay={handlePlayTrack}
                        currentId={currentTrack?.id}
                        isPlaying={isPlaying}
                      />
                    </div>
                    <p className="relative z-10 mt-2 text-center text-xs text-[rgba(243,238,231,.38)]">
                      Geser kartu untuk menjelajah · ketuk kartu tengah untuk memutar
                    </p>
                  </section>
                )}

                {/* Section Title Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-5 h-5 text-stone-500" />
                    <h2 className="font-display uppercase text-xl sm:text-3xl leading-[1.05] tracking-tight text-white">
                      {searchQuery
                        ? `Hasil Pencarian: "${searchQuery}"`
                        : `Katalog Musik: ${selectedCategory.name}`}
                    </h2>
                  </div>
                  <span className="text-xs text-stone-400 font-mono bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.06]">
                    {tracks.length} Lagu Tersedia
                  </span>
                </div>

                {/* Error message */}
                {error && (
                  <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-950/40 border border-red-800/60 text-red-300 text-sm mb-6">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Loading Skeletons */}
                {loading && (
                  <div className="no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-3 overflow-x-auto overscroll-x-contain snap-x snap-mandatory md:flex-wrap md:justify-center md:gap-4 md:overflow-visible">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div
                        key={index}
                        className="bg-[#15120f]/80 border border-white/[0.05] rounded-2xl p-2 sm:p-3 animate-pulse w-[calc((100vw-3.5rem)/3)] sm:w-[calc((100vw-5.5rem)/3)] max-w-[132px] md:w-[168px] lg:w-[184px] md:max-w-none shrink-0 snap-start"
                      >
                        <div className="aspect-square w-full bg-[#1d1915] rounded-2xl mb-3" />
                        <div className="h-4 bg-[#1d1915] rounded w-3/4 mb-2" />
                        <div className="h-3 bg-[#1d1915]/70 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Tracks Grid */}
                {!loading && tracks.length > 0 && (
                  <div className="no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-3 overflow-x-auto overscroll-x-contain snap-x snap-mandatory md:flex-wrap md:justify-center md:gap-4 md:overflow-visible">
                    {tracks.map((track) => (
                      <TrackCard
                        key={track.id}
                        track={track}
                        isCurrent={currentTrack?.id === track.id}
                        isPlaying={isPlaying}
                        onPlayTrack={handlePlayTrack}
                      />
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {!loading && tracks.length === 0 && !error && (
                  <div className="text-center py-24 rounded-2xl bg-[#15120f]/40 border border-white/[0.04]">
                    <Music2 className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-stone-300">
                      Tidak ada lagu ditemukan
                    </h3>
                    <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
                      Coba cari dengan kata kunci artis, judul lagu lain, atau pilih kategori dari sidebar.
                    </p>
                  </div>
                )}
              </section>
            )}
          </main>

          {/* 3-Zone Architecture: Right Panel */}
          {activeTab === "music" && layoutMode === "dashboard" && (
            <RightPanel tracks={tracks} onPlayTrack={handlePlayTrack} />
          )}
        </div>
      </div>

      {authError && (
        <div role="alert" className="fixed bottom-28 right-5 z-[130] max-w-sm rounded-xl border border-red-400/30 bg-[#25110f] px-4 py-3 text-sm text-red-100 shadow-xl">
          <div className="flex items-start gap-3">
            <span className="flex-1">{authError}</span>
            <button type="button" onClick={clearAuthError} aria-label="Tutup pesan" className="text-red-200 hover:text-white">×</button>
          </div>
        </div>
      )}

      {/* Floating Bottom Music Player */}
      <Player />

      {/* Auth Modal (Login / Register) */}
      <AuthModal />

      {/* Saved Tracks Panel */}
      {savedPanelOpen && (
        <SavedTracksPanel
          onClose={() => setSavedPanelOpen(false)}
          onPlayTrack={(track) => { handlePlayTrack(track); setSavedPanelOpen(false); }}
        />
      )}
    </div>
  );
}
