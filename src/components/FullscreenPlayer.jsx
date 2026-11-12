import React, { useEffect, useMemo, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Repeat2,
  Volume2,
  VolumeX,
  Minimize2,
  Music2,
  Disc3,
} from "lucide-react";
import { fetchLyrics, formatDuration } from "../services/musicApi";
import { useAudio } from "../context/AudioContext";

export default function FullscreenPlayer({ isOpen, onClose }) {
  const [lyrics, setLyrics] = useState(null);
  const [lyricsError, setLyricsError] = useState(false);
  const timedLyrics = useMemo(() => Array.isArray(lyrics?.lyrics) ? lyrics.lyrics : [], [lyrics]);
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    isShuffle,
    repeatMode,
    isLoopSegment,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleLoopSegment,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
  } = useAudio();

  useEffect(() => {
    if (!isOpen || currentTrack?.source !== "youtube" || !currentTrack.videoId) return undefined;
    const controller = new AbortController();
    setLyrics(null);
    setLyricsError(false);
    fetchLyrics(currentTrack.videoId, { signal: controller.signal })
      .then(setLyrics)
      .catch((error) => {
        if (error.name !== "AbortError") setLyricsError(true);
      });
    return () => controller.abort();
  }, [isOpen, currentTrack?.videoId, currentTrack?.source]);

  // Escape key listener untuk menutup fullscreen
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !currentTrack) return null;

  const artwork =
    currentTrack.artwork ||
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tampilan Fullscreen Pemutar Musik"
      className="fixed inset-0 z-[100] bg-black text-slate-100 overflow-y-auto overflow-x-hidden select-none animate-in fade-in duration-300"
    >
      {/* Soft, blurred cover backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.82), rgba(0,0,0,.58)), url(${artwork})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          filter: "blur(28px)",
          transform: "scale(1.08)",
          opacity: 0.45,
        }}
      />
      <div aria-hidden="true" className="fixed inset-0 bg-black/55 pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/40">
            <Music2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400 block">
                Studio Stage
              </span>
              {/* Animated Live Equalizer Bar */}
              {isPlaying && (
                <div className="flex items-end gap-1 h-3.5" aria-label="Audio sedang berputar">
                  <span className="w-0.5 bg-emerald-400 rounded-full animate-eq-1" />
                  <span className="w-0.5 bg-emerald-400 rounded-full animate-eq-2" />
                  <span className="w-0.5 bg-emerald-400 rounded-full animate-eq-3" />
                  <span className="w-0.5 bg-emerald-400 rounded-full animate-eq-4" />
                </div>
              )}
            </div>
            <span className="text-sm font-black tracking-wider text-slate-200">
              IRAMA<span className="text-emerald-400">NUSANTARA</span>
            </span>
          </div>
        </div>

        {/* Exit Fullscreen Button */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-slate-300 hover:text-white transition-all text-xs font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 shadow-xl hover:scale-105 active:scale-95"
          aria-label="Tutup mode fullscreen (Escape)"
        >
          <Minimize2 className="w-4 h-4" />
          <span className="hidden sm:inline">Exit Fullscreen (Esc)</span>
        </button>
      </header>

      {/* Center Stage: Hero Artwork & Animated Disc */}
      <main className="relative z-10 grid min-h-[calc(100dvh-10rem)] grid-cols-1 lg:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.15fr)] items-center gap-8 lg:gap-14 max-w-[1400px] mx-auto w-full px-5 py-6 sm:px-8 lg:px-12">
        {/* Animated Artwork & Vinyl Console */}
        <div className="relative group shrink-0 flex flex-col items-center justify-center w-full max-w-[620px] mx-auto">
          {/* Cover Art Card */}
          <div
            className={`relative z-10 w-full aspect-square max-w-[min(68vw,620px)] lg:max-w-[min(38vw,620px)] rounded-[1.6rem] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,.5)] border border-white/10 bg-[#0a0f0d] transition-all duration-700 ease-out ${
              isPlaying
                ? "scale-100 shadow-emerald-950/40"
                : "scale-95 opacity-85 shadow-black"
            }`}
          >
            <img
              src={artwork}
              alt={currentTrack.title}
              className={`w-full h-full object-cover transition-transform duration-1000 ${
                isPlaying ? "scale-105" : "scale-100"
              }`}
            />
            {/* Glossy Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />
          </div>

          {/* Realistic Animated Rotating Vinyl Disc Behind Cover */}
          <div
            aria-hidden="true"
            className={`hidden md:flex absolute top-1/2 -translate-y-1/2 w-72 h-72 lg:w-80 lg:h-80 rounded-full bg-[#0a0f0d] border border-white/[0.12] shadow-2xl items-center justify-center transition-all duration-1000 ease-out pointer-events-none ${
              isPlaying
                ? "translate-x-28 lg:translate-x-36 opacity-100"
                : "translate-x-0 opacity-0"
            }`}
          >
            {/* Spinning Groove Texture */}
            <div
              className={`w-full h-full rounded-full border-8 border-black/90 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 ${
                isPlaying ? "animate-spin-slow" : ""
              }`}
            >
              {/* Circular Vinyl Grooves */}
              <div className="absolute inset-4 rounded-full border border-white/[0.05]" />
              <div className="absolute inset-8 rounded-full border border-white/[0.05]" />
              <div className="absolute inset-14 rounded-full border border-white/[0.05]" />
              <div className="absolute inset-20 rounded-full border border-white/[0.05]" />

              {/* Center Vinyl Label */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 border-2 border-white/20 flex items-center justify-center shadow-inner">
                <Disc3 className="w-10 h-10 text-white/80" />
              </div>
            </div>
          </div>
        </div>

        <section className="relative w-full max-w-3xl h-[42vh] lg:h-[62vh] flex flex-col justify-center overflow-hidden px-2 sm:px-6" aria-label="Lirik lagu" aria-live="polite">
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight line-clamp-1">{currentTrack.title}</h2>
            <p className="text-sm sm:text-base font-medium text-emerald-400 line-clamp-1 mt-0.5">{currentTrack.artist}</p>
          </div>
          {timedLyrics.length ? (
            <div className="w-full flex-1 overflow-y-auto space-y-4 sm:space-y-6 text-xl sm:text-3xl lg:text-[clamp(1.75rem,3.2vw,3.5rem)] font-bold leading-[1.2] tracking-tight [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] [scrollbar-width:none]">
              {timedLyrics.map((line, index) => {
                const startTime = Number(line.startTime ?? line.start_time ?? 0);
                const endTime = Number(line.endTime ?? line.end_time ?? 0);
                const text = line.text ?? line.lyricLine ?? "";
                const active = currentTime * 1000 >= startTime && (!endTime || currentTime * 1000 < endTime);
                return (
                  <p
                    key={line.id ?? index}
                    className={`transition-all duration-300 ${
                      active
                        ? "text-white scale-100 origin-left font-black drop-shadow-[0_2px_12px_rgba(16,185,129,0.35)]"
                        : "text-white/30 scale-95 origin-left"
                    }`}
                  >
                    {text}
                  </p>
                );
              })}
            </div>
          ) : typeof lyrics?.lyrics === "string" ? (
            <div className="flex-1 w-full overflow-y-auto whitespace-pre-line py-4 text-lg sm:text-2xl lg:text-3xl font-bold leading-[1.4] tracking-tight text-white/80 [scrollbar-width:thin]">
              {lyrics.lyrics}
            </div>
          ) : (
            <div className="py-8">
              <p className="text-base sm:text-lg text-white/60 font-medium">
                {lyricsError ? "Lirik belum tersedia untuk lagu ini." : "Memuat lirik lagu…"}
              </p>
            </div>
          )}
        </section>

        <div className="sr-only">
          <h2>{currentTrack.title}</h2>
          <p>{currentTrack.artist}</p>
        </div>
      </main>

      {/* Bottom Controls Console */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full flex flex-col gap-5 pt-4">
        {/* Progress Scrubber Bar */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span className="w-10 text-right tabular-nums select-none">
            {formatDuration(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 30}
            step="0.1"
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            aria-label="Posisi pemutaran fullscreen"
            className="flex-1 h-2 bg-[#14201a] rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:bg-[#1a2b23] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          />
          <span className="w-10 tabular-nums select-none">{formatDuration(duration)}</span>
        </div>

        {/* Master Action Controls & Volume */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Secondary Left (Loop & Shuffle) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleShuffle}
              className={`p-3 rounded-2xl transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 hover:scale-105 active:scale-95 ${
                isShuffle
                  ? "text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 shadow-md shadow-emerald-950/50"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
              }`}
              title={isShuffle ? "Acak lagu: Aktif" : "Acak lagu: Nonaktif"}
              aria-label="Acak lagu"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={toggleRepeat}
              className={`p-3 rounded-2xl transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 hover:scale-105 active:scale-95 ${
                repeatMode !== "off"
                  ? "text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 shadow-md shadow-emerald-950/50"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
              }`}
              title={`Ulangi: ${repeatMode}`}
              aria-label="Ulangi lagu"
            >
              {repeatMode === "one" ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={toggleLoopSegment}
              className={`p-3 rounded-2xl transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 hover:scale-105 active:scale-95 ${
                isLoopSegment
                  ? "text-emerald-200 bg-emerald-500/30 border border-emerald-400/40 shadow-md shadow-emerald-950/50"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.06]"
              }`}
              title={isLoopSegment ? "Reff Loop: Aktif" : "Reff Loop: Nonaktif"}
              aria-label="Reff Loop"
            >
              <Repeat2 className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Playback Center */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={prevTrack}
              className="p-3 text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-2xl transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 hover:scale-105 active:scale-95"
              title="Lagu Sebelumnya"
              aria-label="Lagu Sebelumnya"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-950/80 border border-emerald-400/40 transition-transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              title={isPlaying ? "Jeda" : "Putar"}
              aria-label={isPlaying ? "Jeda" : "Putar"}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-7 h-7 fill-white" />
              ) : (
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={nextTrack}
              className="p-3 text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-2xl transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 hover:scale-105 active:scale-95"
              title="Lagu Berikutnya"
              aria-label="Lagu Berikutnya"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
          </div>

          {/* Volume Control Right */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleMute}
              className="p-3 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-2xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              title={isMuted || volume === 0 ? "Batal Bisukan" : "Bisukan"}
              aria-label="Bisukan"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 text-emerald-400" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Volume Fullscreen"
              className="w-24 sm:w-32 h-1.5 bg-[#14201a] rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:bg-[#1a2b23] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
