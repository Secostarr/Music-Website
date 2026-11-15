import React, { useState } from "react";
import { Play, Pause, Music, Heart } from "lucide-react";
import { formatDuration, artworkCandidates } from "../services/musicApi";
import { useAuth } from "../context/AuthContext";

export default function TrackCard({ track, isCurrent, isPlaying, onPlayTrack }) {
  // 0..n = kandidat sumber (artwork asli → maxres → sd → hq), melewati jumlah = placeholder
  const [artStage, setArtStage] = useState(0);
  const { isTrackSaved, toggleSaveTrack } = useAuth();
  const isSaved = isTrackSaved(track.id);

  const handleSaveClick = (e) => {
    e.stopPropagation();
    toggleSaveTrack(track);
  };

  const hasValidPreview =
    typeof track.previewDuration === "number" &&
    Number.isFinite(track.previewDuration) &&
    track.previewDuration > 0;
  const isYouTube = track.source === "youtube";

  const handleCardClick = () => {
    onPlayTrack(track);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPlayTrack(track);
    }
  };

  const candidates = artworkCandidates(track);
  const artworkSrc = candidates[Math.min(artStage, candidates.length)] || "";
  const hasValidArtwork = artStage < candidates.length && Boolean(artworkSrc);

  const handleArtworkError = () => setArtStage((stage) => stage + 1);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      aria-label={`${track.title} oleh ${track.artist}. ${isCurrent && isPlaying ? "Jeda pemutaran" : "Putar lagu"}`}
      className={`group relative flex flex-col w-[calc((100vw-3.5rem)/3)] sm:w-[calc((100vw-5.5rem)/3)] max-w-[132px] md:w-[168px] lg:w-[184px] md:max-w-none shrink-0 snap-start p-2 sm:p-3 rounded-2xl transition-all duration-300 cursor-pointer border focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060907] ${
        isCurrent
          ? "bg-[#1d1915] border-[#d9141f]/50 shadow-xl shadow-[#59060b]/40"
          : "bg-[#15120f]/80 hover:bg-[#1d1915] border-white/[0.06] hover:border-white/20 hover:shadow-xl hover:shadow-[#59060b]/20"
      }`}
    >
      {/* Artwork container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#080706] mb-2 sm:mb-3 shadow-lg shadow-black/60 border border-white/[0.06]">
        {hasValidArtwork ? (
          <img
            src={artworkSrc}
            alt={track.title}
            loading="lazy"
            onError={handleArtworkError}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-[radial-gradient(circle_at_50%_35%,#241d18,#0b0a09)] text-stone-600 p-2">
            <Music className="w-6 h-6 sm:w-8 sm:h-8" aria-hidden="true" />
            <span className="text-[10px] text-stone-400 text-center line-clamp-2 leading-tight">{track.title}</span>
            <span className="sr-only">Tidak ada gambar sampul</span>
          </div>
        )}

        {/* Play/Pause visual indicator overlay */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-[#080706]/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
            isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#d9141f] to-[#a01015] group-hover:scale-105 text-white flex items-center justify-center shadow-xl shadow-[#59060b]/70 border border-[#ef2430]/40 transition-transform">
            {isCurrent && isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white translate-x-0.5" />
            )}
          </div>
        </div>

        {/* Tombol Simpan — pojok kanan atas artwork, selalu terlihat */}
        <button
          type="button"
          onClick={handleSaveClick}
          aria-label={isSaved ? `Hapus ${track.title} dari koleksi` : `Simpan ${track.title} ke koleksi`}
          className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f] shadow-lg backdrop-blur-md border ${
            isSaved
              ? "bg-[#d9141f]/90 border-[#ef2430]/60 text-white scale-100"
              : "bg-black/50 border-white/10 text-stone-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-black/70 hover:text-stone-100"
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
        </button>



        {/* Preview Duration badge */}
        {!isYouTube && hasValidPreview && (
          <span className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 text-[9px] sm:text-[10px] bg-[#080706]/85 backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded-md text-stone-300 font-mono font-medium border border-white/[0.08] z-10 pointer-events-none">
            {formatDuration(track.previewDuration)}
          </span>
        )}
      </div>

      {/* Track Info */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h3
            className={`font-semibold text-xs sm:text-sm line-clamp-1 transition-colors ${
              isCurrent ? "text-[#f44551] font-bold" : "text-stone-100 group-hover:text-stone-100"
            }`}
            title={track.title}
          >
            {track.title}
          </h3>
          <p
            className="text-[10px] sm:text-xs text-stone-400 line-clamp-1 mt-0.5"
            title={track.artist}
          >
            {track.artist}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 sm:mt-3 sm:pt-2.5 border-t border-white/[0.05] text-[11px] text-stone-500">
          {track.album && (
            <span className="hidden sm:block truncate max-w-[100px]">{track.album}</span>
          )}
          {typeof track.duration === "number" && track.duration > 0 && (
            <span
              className="font-mono text-stone-400 ml-auto"
              title={`Durasi lagu penuh: ${formatDuration(track.duration)}`}
            >
              {formatDuration(track.duration)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
