import React from "react";
import { Play, Pause, Radio } from "lucide-react";
import { formatDuration } from "../services/musicApi";

export default function TrackCard({ track, isCurrent, isPlaying, onPlayTrack }) {
  const artwork =
    track.artwork ||
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60";

  return (
    <div
      onClick={() => onPlayTrack(track)}
      className={`group relative flex flex-col p-3 rounded-2xl transition-all duration-300 cursor-pointer border ${
        isCurrent
          ? "bg-purple-950/35 border-purple-500/60 shadow-lg shadow-purple-900/25"
          : "bg-gray-900/40 hover:bg-gray-800/60 border-gray-800/60 hover:border-gray-700/80"
      }`}
    >
      {/* Artwork container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-950 mb-3 shadow-md">
        <img
          src={artwork}
          alt={track.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Play/Pause hover overlay */}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
            isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/50 transform group-hover:scale-105 transition-all">
            {isCurrent && isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white translate-x-0.5" />
            )}
          </div>
        </div>

        {/* HQ audio tag */}
        <span className="absolute bottom-2 right-2 text-[10px] bg-black/75 backdrop-blur-sm px-2 py-0.5 rounded text-purple-300 font-semibold border border-purple-500/20">
          HQ Preview
        </span>
      </div>

      {/* Track Info */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h3
            className={`font-semibold text-sm line-clamp-1 transition-colors ${
              isCurrent ? "text-purple-400 font-bold" : "text-gray-100 group-hover:text-purple-300"
            }`}
            title={track.title}
          >
            {track.title}
          </h3>
          <p
            className="text-xs text-gray-400 line-clamp-1 mt-0.5 hover:underline"
            title={track.artist}
          >
            {track.artist}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-800/40 text-[11px] text-gray-500">
          <span className="truncate max-w-[130px] italic">{track.album || "Single"}</span>
          <span className="font-mono text-gray-400">{formatDuration(track.duration)}</span>
        </div>
      </div>
    </div>
  );
}
