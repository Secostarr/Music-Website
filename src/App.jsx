import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import TrackCard from "./components/TrackCard";
import Player from "./components/Player";
import { fetchTrendingTracks, searchTracks } from "./services/audius";
import { Sparkles, TrendingUp, Music2, AlertCircle } from "lucide-react";

export default function App() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  // Load tracks on genre change or initial mount
  useEffect(() => {
    loadTracks(selectedGenre);
  }, [selectedGenre]);

  const loadTracks = async (genre) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTrendingTracks(genre);
      setTracks(data);
      if (data.length > 0 && !currentTrack) {
        // Prepare initial track without autoplaying
        setCurrentTrack(data[0]);
      }
    } catch (err) {
      setError("Gagal memuat daftar lagu. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadTracks(selectedGenre);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await searchTracks(searchQuery);
      setTracks(results);
    } catch (err) {
      setError("Gagal melakukan pencarian lagu.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (!tracks.length) return;
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrack(tracks[randomIndex]);
      setIsPlaying(true);
      return;
    }
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (!tracks.length) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[prevIndex]);
    setIsPlaying(true);
  };

  const featuredTrack = tracks[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100 flex flex-col pb-28">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        selectedGenre={selectedGenre}
        onSelectGenre={(genre) => {
          setSelectedGenre(genre);
          setSearchQuery("");
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full flex-1">
        {/* Featured Hero Banner */}
        {featuredTrack && !loading && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-gray-900 border border-purple-500/20 p-6 sm:p-8 mb-8 shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> Featured Track
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight line-clamp-1">
                  {featuredTrack.title}
                </h2>
                <p className="text-sm text-gray-300 mt-1 line-clamp-1">
                  By <span className="font-semibold text-purple-300">{featuredTrack.user?.name}</span>
                </p>
                <div className="flex items-center gap-3 mt-5">
                  <button
                    onClick={() => handlePlayTrack(featuredTrack)}
                    className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2"
                  >
                    {currentTrack?.id === featuredTrack.id && isPlaying ? "Pause" : "Play Now"}
                  </button>
                  <span className="text-xs text-gray-400 font-mono">
                    {featuredTrack.genre || "Featured"}
                  </span>
                </div>
              </div>

              {/* Artwork Preview */}
              <div className="hidden sm:block relative w-36 h-36 rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
                <img
                  src={
                    featuredTrack.artwork?.["480x480"] ||
                    featuredTrack.artwork?.["150x150"] ||
                    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60"
                  }
                  alt={featuredTrack.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          </div>
        )}

        {/* Section Title */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              {searchQuery ? `Hasil Pencarian "${searchQuery}"` : `Trending: ${selectedGenre}`}
            </h2>
          </div>
          <span className="text-xs text-gray-400">{tracks.length} Lagu</span>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-sm mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-900/40 border border-gray-800/40 rounded-2xl p-3 animate-pulse"
              >
                <div className="aspect-square w-full bg-gray-800/60 rounded-xl mb-3" />
                <div className="h-4 bg-gray-800/60 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-800/40 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Tracks Grid */}
        {!loading && tracks.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
          <div className="text-center py-20">
            <Music2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-300">Tidak ada lagu ditemukan</h3>
            <p className="text-sm text-gray-500 mt-1">
              Coba cari dengan kata kunci lain atau pilih genre lain.
            </p>
          </div>
        )}
      </main>

      {/* Floating Bottom Player */}
      <Player
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onNext={handleNext}
        onPrev={handlePrev}
        isShuffle={isShuffle}
        setIsShuffle={setIsShuffle}
      />
    </div>
  );
}
