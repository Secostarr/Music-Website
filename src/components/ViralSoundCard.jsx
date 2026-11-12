import React, { useState } from "react";
import { Play, Pause, Music, Repeat2, Quote, ExternalLink } from "lucide-react";
import { formatDuration } from "../services/musicApi";
import { useAudio } from "../context/AudioContext";

export default function ViralSoundCard({ sound }) {
  const [imageError, setImageError] = useState(false);
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const isCurrent = currentTrack?.id === sound.id;

  const handlePlay = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(sound);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePlay(e);
    }
  };

  const hasSegment =
    typeof sound.segmentStart === "number" &&
    typeof sound.segmentEnd === "number" &&
    sound.segmentEnd > sound.segmentStart;

  const segmentDuration = hasSegment
    ? sound.segmentEnd - sound.segmentStart
    : sound.previewDuration || 0;

  const rawArtwork = typeof sound.artwork === "string" ? sound.artwork.trim() : "";
  const hasValidArtwork = rawArtwork.length > 0 && !imageError;

  return (
    <div
      role="article"
      aria-label={`${sound.title} oleh ${sound.artist}`}
      className={`group relative flex flex-col p-3 rounded-2xl transition-all duration-300 border ${
        isCurrent
          ? "bg-[#14201a] border-emerald-500/50 shadow-lg shadow-emerald-950/40"
          : "bg-[#0f1713]/70 hover:bg-[#14201a] border-white/[0.06] hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-950/20"
      }`}
    >
      {/* Artwork & Play overlay */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#060907] mb-3 shadow-md border border-white/[0.04]">
        {hasValidArtwork ? (
          <img
            src={rawArtwork}
            alt={sound.title}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0f0d] text-slate-500 p-2">
            <Music className="w-8 h-8 text-emerald-500/40 mb-1" />
            <span className="text-[10px] text-slate-500 text-center line-clamp-1">
              Sound Viral
            </span>
          </div>
        )}

        {/* Kategori Badge */}
        {sound.viralMeta?.category && (
          <div className="absolute top-2 left-2 z-10">
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#060907]/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 shadow">
              {sound.viralMeta.category}
            </span>
          </div>
        )}

        {/* Reff Loop Badge Indicator */}
        {hasSegment && (
          <div
            className="absolute top-2 right-2 z-10"
            title="Cuplikan hook reff yang dapat di-loop otomatis"
          >
            <span className="p-1 rounded-md bg-[#060907]/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 flex items-center justify-center shadow">
              <Repeat2 className="w-3.5 h-3.5" />
            </span>
          </div>
        )}

        {/* Play Button Overlay */}
        <div
          className={`absolute inset-0 bg-[#060907]/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${
            isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <button
            type="button"
            onClick={handlePlay}
            onKeyDown={handleKeyDown}
            aria-label={isCurrent && isPlaying ? "Jeda sound" : "Putar sound"}
            className="w-12 h-12 rounded-full bg-emerald-500/95 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-950/60 border border-emerald-400/30 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white translate-x-0.5" />
            )}
          </button>
        </div>

        {/* Durasi Hook Reff */}
        {segmentDuration > 0 && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-[#060907]/85 backdrop-blur-md text-[10px] font-mono text-emerald-300 border border-emerald-500/20 z-10 pointer-events-none">
            Hook {formatDuration(segmentDuration)}
          </div>
        )}
      </div>

      {/* Quote / Hook Text jika tersedia */}
      {sound.viralMeta?.quote && (
        <div className="mb-2.5 p-2 rounded-lg bg-[#14201a]/90 border border-emerald-500/20 flex items-start gap-1.5">
          <Quote className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-200/90 italic line-clamp-2 leading-relaxed">
            "{sound.viralMeta.quote}"
          </p>
        </div>
      )}

      {/* Metadata Lagu */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <button
            type="button"
            onClick={handlePlay}
            className="text-left w-full focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded cursor-pointer"
          >
            <h4
              className="text-sm font-semibold text-slate-100 truncate group-hover:text-emerald-300 transition-colors"
              title={sound.title}
            >
              {sound.title}
            </h4>
          </button>
          <p className="text-xs text-slate-400 truncate mt-0.5" title={sound.artist}>
            {sound.artist}
          </p>
        </div>

        {/* Status Legalitas & Tautan Izin */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.06] text-[11px] text-slate-500">
          <span className="font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Verified Legal
          </span>

          {sound.legalMeta?.evidenceReference?.startsWith("https://") && (
            <a
              href={sound.legalMeta.evidenceReference}
              target="_blank"
              rel="noopener noreferrer"
              title="Lihat dokumen bukti izin resmi (buka di tab baru)"
              className="text-slate-400 hover:text-emerald-300 transition-colors ml-1 p-1 -m-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
