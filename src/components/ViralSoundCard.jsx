import React, { useState } from "react";
import { Play, Pause, Repeat, Quote, ExternalLink, Music } from "lucide-react";
import { formatDuration } from "../services/musicApi";

/**
 * Komponen kartu untuk curated viral sound / potongan reff.
 * Menggunakan struktur semantik <article> non-interaktif dengan kontrol <button> mandiri
 * dan tautan eksternal <a> mandiri untuk mencegah pelanggaran WAI-ARIA nested interactive elements.
 *
 * @param {Object} props
 * @param {import('../data/viralSounds').UnifiedTrack} props.track - Data UnifiedTrack
 * @param {boolean} props.isCurrent - Apakah track ini sedang aktif di player
 * @param {boolean} props.isPlaying - Apakah player sedang memutar audio
 * @param {(track: import('../data/viralSounds').UnifiedTrack) => void} props.onPlayTrack - Handler play
 */
export default function ViralSoundCard({ track, isCurrent, isPlaying, onPlayTrack }) {
  const [imageError, setImageError] = useState(false);

  // Validasi durasi audio yang benar-benar dapat diputar
  const rawDuration =
    typeof track.segmentEnd === "number" &&
    typeof track.segmentStart === "number" &&
    Number.isFinite(track.segmentEnd) &&
    Number.isFinite(track.segmentStart) &&
    track.segmentEnd > track.segmentStart
      ? track.segmentEnd - track.segmentStart
      : typeof track.previewDuration === "number" &&
        Number.isFinite(track.previewDuration) &&
        track.previewDuration > 0
      ? track.previewDuration
      : typeof track.duration === "number" &&
        Number.isFinite(track.duration) &&
        track.duration > 0
      ? track.duration
      : null;

  const quote = track.viralMeta?.quote;
  const trendTag = track.viralMeta?.trendTag;

  const rawArtwork = typeof track.artwork === "string" ? track.artwork.trim() : "";
  const hasValidArtwork = rawArtwork.length > 0 && !imageError;

  return (
    <article
      aria-label={`${track.title} oleh ${track.artist}`}
      className={`group relative flex flex-col p-4 rounded-2xl transition-all duration-300 border ${
        isCurrent
          ? "bg-[#141724] border-purple-500/50 shadow-lg shadow-purple-950/40"
          : "bg-[#0f111a]/70 hover:bg-[#141724] border-white/[0.06] hover:border-purple-500/30 hover:shadow-md hover:shadow-purple-950/20"
      }`}
    >
      {/* Artwork & Play Button Area */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#050608] mb-3.5 shadow-md border border-white/[0.04]">
        {hasValidArtwork ? (
          <img
            src={rawArtwork}
            alt={track.title}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#090a0f] text-slate-500 p-2">
            <Music className="w-8 h-8 text-purple-500/40 mb-1" />
            <span className="text-[10px] text-slate-500 text-center line-clamp-1">
              {track.artist}
            </span>
          </div>
        )}

        {/* Tag badge jika ada */}
        {trendTag && (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#050608]/85 backdrop-blur-md text-purple-300 border border-purple-500/30 shadow">
              #{trendTag}
            </span>
          </div>
        )}

        {/* Looping segment badge */}
        {track.isLoopable && (
          <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
            <span
              className="p-1 rounded-md bg-[#050608]/85 backdrop-blur-md text-purple-300 border border-purple-500/30 flex items-center justify-center shadow"
              title="Auto Reff Looping"
              aria-hidden="true"
            >
              <Repeat className="w-3 h-3" />
            </span>
          </div>
        )}

        {/* Play/Pause Button Overlay Semantik */}
        <div
          className={`absolute inset-0 bg-[#050608]/50 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${
            isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <button
            type="button"
            onClick={() => onPlayTrack(track)}
            aria-label={
              isCurrent && isPlaying
                ? `Jeda pemutaran ${track.title}`
                : `Putar sound ${track.title} oleh ${track.artist}`
            }
            className="w-12 h-12 rounded-full bg-purple-600/95 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-950/60 border border-purple-400/30 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer"
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white translate-x-0.5" />
            )}
          </button>
        </div>

        {/* Duration badge */}
        {rawDuration !== null && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-[#050608]/85 backdrop-blur-md text-[10px] font-mono text-purple-300 border border-purple-500/20 z-10 pointer-events-none">
            {formatDuration(rawDuration)}
          </div>
        )}
      </div>

      {/* Quote / Hook Callout jika tersedia */}
      {quote && (
        <div className="mb-2.5 p-2 rounded-lg bg-[#141724]/90 border border-purple-500/20 flex items-start gap-1.5">
          <Quote className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
          <p className="text-xs text-purple-200/90 italic line-clamp-2 leading-relaxed">
            "{quote}"
          </p>
        </div>
      )}

      {/* Info Title & Artist (dengan tombol semantik untuk memutar jika teks diklik) */}
      <div className="flex-1 min-w-0">
        <button
          type="button"
          onClick={() => onPlayTrack(track)}
          aria-label={`Pilih sound ${track.title}`}
          className="text-left w-full focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 rounded cursor-pointer"
        >
          <h4
            className="text-sm font-semibold text-slate-100 truncate group-hover:text-purple-300 transition-colors"
            title={track.title}
          >
            {track.title}
          </h4>
          <p className="text-xs text-slate-400 truncate mt-0.5" title={track.artist}>
            {track.artist}
          </p>
        </button>
      </div>

      {/* Attribution / Credit Footer */}
      {track.attribution && (
        <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
          <span className="truncate max-w-[150px]" title={track.attribution}>
            {track.attribution}
          </span>
          {track.sourceUrl && (
            <a
              href={track.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-purple-300 transition-colors ml-1 p-1 -m-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 rounded cursor-pointer"
              title="Kunjungi sumber resmi"
              aria-label={`Kunjungi sumber resmi ${track.title}`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}
    </article>
  );
}
