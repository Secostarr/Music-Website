import React, { useState } from "react";
import { Play, Pause, Music, Repeat2, Quote, ExternalLink } from "lucide-react";
import { formatDuration, artworkCandidates } from "../services/musicApi";
import { useAudio } from "../context/AudioContext";

export default function ViralSoundCard({ sound }) {
  // 0..n = kandidat sumber (artwork asli → maxres → sd → hq), melewati jumlah = placeholder
  const [artStage, setArtStage] = useState(0);
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

  const candidates = artworkCandidates(sound);
  const artworkSrc = candidates[Math.min(artStage, candidates.length)] || "";
  const hasValidArtwork = artStage < candidates.length && Boolean(artworkSrc);

  const handleArtworkError = () => setArtStage((stage) => stage + 1);

  return (
    <div
      role="article"
      aria-label={`${sound.title} oleh ${sound.artist}`}
      className={`group relative flex flex-col w-[calc((100vw-3.5rem)/2)] sm:w-[240px] max-w-[240px] md:w-[268px] lg:w-[300px] md:max-w-none shrink-0 snap-start p-3 rounded-2xl transition-all duration-300 border ${
        isCurrent
          ? "bg-[#1d1915] border-[#d9141f]/50 shadow-lg shadow-[#59060b]/40"
          : "bg-[#15120f]/70 hover:bg-[#1d1915] border-white/[0.06] hover:border-white/20 hover:shadow-md hover:shadow-[#59060b]/20"
      }`}
    >
      {/* Artwork & Play overlay */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#080706] mb-3 shadow-md border border-white/[0.04]">
        {hasValidArtwork ? (
          <img
            src={artworkSrc}
            alt={sound.title}
            loading="lazy"
            onError={handleArtworkError}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-[radial-gradient(circle_at_50%_35%,#241d18,#0b0a09)] text-stone-600 p-2">
            <Music className="w-6 h-6 sm:w-8 sm:h-8" aria-hidden="true" />
            <span className="text-[10px] text-stone-400 text-center line-clamp-2 leading-tight">{sound.title}</span>
            <span className="sr-only">Tidak ada gambar sampul</span>
          </div>
        )}

        {/* Kategori Badge */}
        {sound.viralMeta?.category && (
          <div className="absolute top-2 left-2 z-10">
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#080706]/85 backdrop-blur-md text-stone-300 border border-white/[0.08] shadow">
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
            <span className="p-1 rounded-md bg-[#080706]/85 backdrop-blur-md text-stone-300 border border-white/[0.08] flex items-center justify-center shadow">
              <Repeat2 className="w-3.5 h-3.5" />
            </span>
          </div>
        )}

        {/* Play Button Overlay */}
        <div
          className={`absolute inset-0 bg-[#080706]/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${
            isCurrent ? "opacity-100" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          }`}
        >
          <button
            type="button"
            onClick={handlePlay}
            onKeyDown={handleKeyDown}
            aria-label={isCurrent && isPlaying ? "Jeda sound" : "Putar sound"}
            className="w-12 h-12 rounded-full bg-[#d9141f]/95 hover:bg-[#d9141f] text-white flex items-center justify-center shadow-lg shadow-[#59060b]/60 border border-[#ef2430]/30 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f] cursor-pointer"
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
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-[#080706]/85 backdrop-blur-md text-[10px] font-mono text-stone-300 border border-white/[0.08] z-10 pointer-events-none">
            Hook {formatDuration(segmentDuration)}
          </div>
        )}
      </div>

      {/* Quote / Hook Text jika tersedia */}
      {sound.viralMeta?.quote && (
        <div className="mb-2.5 p-2 rounded-lg bg-[#15120f]/90 border border-white/[0.08] flex items-start gap-1.5">
          <Quote className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
          <p className="text-xs text-[#f5b8b8]/90 italic line-clamp-2 leading-relaxed">
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
            className="text-left w-full focus:outline-none focus-visible:ring-1 focus-visible:ring-[#d9141f] rounded cursor-pointer"
          >
            <h4
              className="text-sm font-semibold text-stone-100 truncate group-hover:text-stone-100 transition-colors"
              title={sound.title}
            >
              {sound.title}
            </h4>
          </button>
          <p className="text-xs text-stone-400 truncate mt-0.5" title={sound.artist}>
            {sound.artist}
          </p>
        </div>

        {/* Status Legalitas & Tautan Izin */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.06] text-[11px] text-stone-500">
          <span className="font-mono text-stone-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d9141f]" />
            Verified Legal
          </span>

          {sound.legalMeta?.evidenceReference?.startsWith("https://") && (
            <a
              href={sound.legalMeta.evidenceReference}
              target="_blank"
              rel="noopener noreferrer"
              title="Lihat dokumen bukti izin resmi (buka di tab baru)"
              className="text-stone-400 hover:text-white transition-colors ml-1 p-3 -m-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f] rounded cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
