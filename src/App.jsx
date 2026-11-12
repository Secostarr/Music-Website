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
import { Sparkles, TrendingUp, Music2, AlertCircle, Play, Pause } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("music"); // 'music' | 'viral'
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(GENRE_PRESETS[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedPanelOpen, setSavedPanelOpen] = useState(false);

  // Audio Context Engine
  const { currentTrack, isPlaying, playTrack, togglePlay, setPlaylist } = useAudio();

  const loadCategoryTracks = useCallback(
    async (category) => {
      setLoading(true);
      setError(null);
      try {
        let data = [];
        if (!category.query) {
          data = await fetchTopCharts();
        } else {
          data = await searchTracks(category.query);
        }
        setTracks(data);
        if (activeTab === "music") {
          setPlaylist(data);
        }
      } catch (err) {
        console.warn("Gagal memuat katalog lagu:", err);
        setError("Gagal memuat lagu. Coba pilih kategori lain atau periksa koneksi internet.");
      } finally {
        setLoading(false);
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
    setActiveTab("music");
    setLoading(true);
    setError(null);
    try {
      const results = await searchTracks(searchQuery);
      setTracks(results);
      setPlaylist(results);
    } catch (err) {
      console.warn("Gagal melakukan pencarian lagu:", err);
      setError("Gagal melakukan pencarian lagu.");
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-[#060907] text-slate-100 flex flex-col">
      {/* 3-Zone Architecture: Left Sidebar */}
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

      {/* Main Layout Container: Offset from Left Sidebar on Desktop */}
      <div className="flex-1 flex flex-col lg:pl-64 xl:pl-72 transition-all">
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
        />

        {/* Center Content + Right Panel Wrapper */}
        <div className="flex-1 flex w-full pb-32">
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
                {/* Cinematic Hero Showcase */}
                {featuredTrack && !loading && (
                  <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#14231b] via-[#0f1713] to-[#060907] border border-white/[0.08] p-6 sm:p-8 lg:p-10 mb-8 shadow-2xl transition-all">
                    {/* Atmospheric Lighting Orbs */}
                    <div
                      aria-hidden="true"
                      className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-28 -left-28 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none"
                    />

                    <div className="relative z-10 flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-8">
                      {/* Left Editorial Info */}
                      <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-4 tracking-wider uppercase">
                          <Sparkles className="w-3.5 h-3.5" /> Spotlight Release
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight line-clamp-2">
                          {featuredTrack.title}
                        </h2>

                        <p className="text-sm sm:text-base text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                          Dengarkan karya unggulan dari{" "}
                          <span className="font-bold text-emerald-300">
                            {featuredTrack.artist}
                          </span>
                          {featuredTrack.album && (
                            <span className="text-slate-400"> dalam album {featuredTrack.album}</span>
                          )}
                          . Dengarkan berbagai lagu hits terpopuler saat ini.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4 mt-7">
                          <button
                            type="button"
                            onClick={() => handlePlayTrack(featuredTrack)}
                            className="px-7 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm transition-all shadow-xl shadow-emerald-950/70 border border-emerald-400/40 flex items-center gap-2.5 cursor-pointer transform hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          >
                            {currentTrack?.id === featuredTrack.id && isPlaying ? (
                              <>
                                <Pause className="w-4 h-4 fill-white" />
                                <span>Jeda lagu</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 fill-white translate-x-0.5" />
                                <span>Putar lagu</span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-white/[0.04] px-4 py-3 rounded-full border border-white/[0.06]">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Audio Streaming Track
                          </div>
                        </div>
                      </div>

                      {/* Right Cinematic Hero Artwork Banner */}
                      <div className="relative w-full sm:w-60 md:w-64 lg:w-72 aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/[0.1] shrink-0 bg-[#060907] group">
                        <img
                          src={
                            featuredTrack.artwork ||
                            "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60"
                          }
                          alt={featuredTrack.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute bottom-3 left-3 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-slate-300 border border-white/10">
                          Now Trending
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Title Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      {searchQuery
                        ? `Hasil Pencarian: "${searchQuery}"`
                        : `Katalog Musik: ${selectedCategory.name}`}
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400 font-mono bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.06]">
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div
                        key={index}
                        className="bg-[#0f1713]/80 border border-white/[0.05] rounded-3xl p-3 animate-pulse"
                      >
                        <div className="aspect-square w-full bg-[#14201a] rounded-2xl mb-3" />
                        <div className="h-4 bg-[#14201a] rounded w-3/4 mb-2" />
                        <div className="h-3 bg-[#14201a]/70 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Tracks Grid */}
                {!loading && tracks.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
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
                  <div className="text-center py-24 rounded-3xl bg-[#0f1713]/40 border border-white/[0.04]">
                    <Music2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-slate-300">
                      Tidak ada lagu ditemukan
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                      Coba cari dengan kata kunci artis, judul lagu lain, atau pilih kategori dari sidebar.
                    </p>
                  </div>
                )}
              </section>
            )}
          </main>

          {/* 3-Zone Architecture: Right Panel */}
          {activeTab === "music" && (
            <RightPanel tracks={tracks} onPlayTrack={handlePlayTrack} />
          )}
        </div>
      </div>

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
