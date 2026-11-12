import React, { useState } from "react";
import { Play, Pause, Music } from "lucide-react";
import { formatDuration } from "../services/musicApi";

export default function TrackCard({ track, isCurrent, isPlaying, onPlayTrack }) {
  const [imageError, setImageError] = useState(false);

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

  const rawArtwork = typeof track.artwork === "string" ? track.artwork.trim() : "";
  const hasValidArtwork = rawArtwork.length > 0 && !imageError;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      aria-label={`${track.title} oleh ${track.artist}. ${isCurrent && isPlaying ? "Jeda pemutaran" : "Putar lagu"}`}
      className={`group relative flex flex-col p-3 rounded-3xl transition-all duration-300 cursor-pointer border focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060907] ${
        isCurrent
          ? "bg-[#14201a] border-emerald-500/50 shadow-xl shadow-emerald-950/40"
          : "bg-[#0f1713]/80 hover:bg-[#14201a] border-white/[0.06] hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-950/20"
      }`}
    >
      {/* Artwork container */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#060907] mb-3 shadow-lg shadow-black/60 border border-white/[0.06]">
        {hasValidArtwork ? (
          <img
            src={rawArtwork}
            alt={track.title}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0f0d] text-slate-500 p-2">
            <Music className="w-8 h-8 text-emerald-500/40 mb-1" />
            <span className="text-[10px] text-slate-500 text-center line-clamp-1">
              {track.artist}
            </span>
          </div>
        )}

        {/* Play/Pause visual indicator overlay */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-[#060907]/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
            isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 group-hover:scale-105 text-white flex items-center justify-center shadow-xl shadow-emerald-950/70 border border-emerald-400/40 transition-transform">
            {isCurrent && isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white translate-x-0.5" />
            )}
          </div>
        </div>



        {/* Preview Duration badge */}
        {!isYouTube && hasValidPreview && (
          <span className="absolute bottom-2.5 right-2.5 text-[10px] bg-[#060907]/85 backdrop-blur-md px-2 py-0.5 rounded-md text-emerald-300 font-mono font-medium border border-emerald-500/20 z-10 pointer-events-none">
            {formatDuration(track.previewDuration)}
          </span>
        )}
      </div>

      {/* Track Info */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h3
            className={`font-semibold text-sm line-clamp-1 transition-colors ${
              isCurrent ? "text-emerald-300 font-bold" : "text-slate-100 group-hover:text-emerald-300"
            }`}
            title={track.title}
          >
            {track.title}
          </h3>
          <p
            className="text-xs text-slate-400 line-clamp-1 mt-0.5"
            title={track.artist}
          >
            {track.artist}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.05] text-[11px] text-slate-500">
            {track.album && (
              <span className="truncate max-w-[120px]">{track.album}</span>
            )}
            {typeof track.duration === "number" && track.duration > 0 && (
              <span
                className="font-mono text-slate-400 shrink-0"
                title={`Durasi lagu penuh: ${formatDuration(track.duration)}`}
              >
                Full {formatDuration(track.duration)}
              </span>
            )}
        </div>
      </div>
    </div>
  );
}
