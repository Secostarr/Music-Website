import React, { useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Repeat2,
  Maximize2,
  Heart,
} from "lucide-react";
import { formatDuration } from "../services/musicApi";
import { useAudio } from "../context/AudioContext";
import { useAuth } from "../context/AuthContext";
import FullscreenPlayer from "./FullscreenPlayer";
import YouTubePlayer from "./YouTubePlayer";

export default function Player() {
  const [showMobileVolume, setShowMobileVolume] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { user, isTrackSaved, toggleSaveTrack } = useAuth();

  const {
    currentTrack,
    currentTime,
    isPlaying,
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

  if (!currentTrack) return null;

  const artwork =
    currentTrack.artwork ||
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60";

  const handleSeekChange = (e) => {
    seek(parseFloat(e.target.value));
  };

  return (
    <>
      {/* Fullscreen Player Modal / Stage */}
      <YouTubePlayer />
      <FullscreenPlayer
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      />

      {/* Floating Bottom Console */}
      <div
        role="region"
        aria-label="Pemutar Audio"
        className="fixed bottom-3 left-2 right-2 sm:left-4 sm:right-4 lg:left-72 xl:left-80 lg:right-6 z-50 rounded-3xl bg-[#0a0f0d]/90 backdrop-blur-2xl border border-white/[0.1] px-4 sm:px-6 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.85)] transition-all"
      >
        {/* Subtle top rim glow */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent pointer-events-none"
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Track Info (Left) */}
          <div className="flex items-center gap-3.5 w-full md:w-1/4 min-w-[180px]">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsFullscreen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsFullscreen(true);
                }
              }}
              title="Klik untuk membuka tampilan fullscreen"
              className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-lg border border-white/[0.08] bg-[#060907] shrink-0 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <img
                src={artwork}
                alt={`Sampul ${currentTrack.title}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <h4
                className="text-xs sm:text-sm font-bold text-slate-100 truncate tracking-tight hover:text-emerald-300 transition-colors cursor-pointer"
                title={currentTrack.title}
                onClick={() => setIsFullscreen(true)}
              >
                {currentTrack.title}
              </h4>
              <p
                className="text-[11px] sm:text-xs text-slate-400 truncate mt-0.5"
                title={currentTrack.artist}
              >
                {currentTrack.artist}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleSaveTrack(currentTrack)}
              aria-label={isTrackSaved(currentTrack.id) ? `Hapus ${currentTrack.title} dari koleksi` : `Simpan ${currentTrack.title} ke koleksi`}
              title={isTrackSaved(currentTrack.id) ? "Hapus dari lagu tersimpan" : "Simpan lagu"}
              className={`shrink-0 p-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isTrackSaved(currentTrack.id)
                  ? "text-emerald-400 hover:text-emerald-300"
                  : "text-slate-400 hover:text-emerald-400"
              }`}
            >
              <Heart className={`w-5 h-5 ${isTrackSaved(currentTrack.id) ? "fill-current" : ""}`} />
            </button>

          </div>

          {/* Center Controls & Scrubber */}
          <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={toggleShuffle}
                className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  isShuffle
                    ? "text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 shadow-sm shadow-emerald-950/40"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
                }`}
                title={isShuffle ? "Acak lagu: Aktif" : "Acak lagu: Nonaktif"}
                aria-label={isShuffle ? "Acak lagu aktif, klik untuk menonaktifkan" : "Acak lagu nonaktif, klik untuk mengaktifkan"}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={prevTrack}
                className="p-1.5 sm:p-2 text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                title="Lagu Sebelumnya"
                aria-label="Lagu Sebelumnya"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-950/70 border border-emerald-400/30 transition-transform active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                title={isPlaying ? "Jeda pemutaran" : "Putar lagu"}
                aria-label={isPlaying ? "Jeda pemutaran" : "Putar lagu"}
              >
                {isLoading ? (
                  <div
                    role="status"
                    aria-label="Memuat audio..."
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                ) : (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white translate-x-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={nextTrack}
                className="p-1.5 sm:p-2 text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                title="Lagu Berikutnya"
                aria-label="Lagu Berikutnya"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </button>

              <button
                type="button"
                onClick={toggleRepeat}
                className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  repeatMode !== "off"
                    ? "text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 shadow-sm shadow-emerald-950/40"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
                }`}
                title={`Ulangi lagu: ${repeatMode === "one" ? "Lagu ini" : repeatMode === "all" ? "Semua lagu" : "Mati"}`}
                aria-label={`Ulangi lagu: ${repeatMode === "one" ? "Lagu ini" : repeatMode === "all" ? "Semua lagu" : "Mati"}`}
              >
                {repeatMode === "one" ? (
                  <Repeat1 className="w-4 h-4" />
                ) : (
                  <Repeat className="w-4 h-4" />
                )}
              </button>

              {/* Loop Segment Button */}
              <button
                type="button"
                onClick={toggleLoopSegment}
                className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  isLoopSegment
                    ? "text-emerald-200 bg-emerald-600/30 border border-emerald-400/40 shadow-sm shadow-emerald-950/40"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
                }`}
                title={isLoopSegment ? "Reff Loop: Aktif" : "Reff Loop: Nonaktif"}
                aria-label={isLoopSegment ? "Reff Loop aktif, klik untuk menonaktifkan" : "Reff Loop nonaktif, klik untuk mengaktifkan"}
              >
                <Repeat2 className="w-4 h-4" />
              </button>
            </div>

            {/* Time scrubber */}
            <div className="w-full flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="w-8 text-right tabular-nums select-none">{formatDuration(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 30}
                step="0.1"
                value={currentTime}
                onChange={handleSeekChange}
                aria-label="Posisi pemutaran lagu"
                aria-valuemin={0}
                aria-valuemax={duration || 30}
                aria-valuenow={currentTime}
                aria-valuetext={`${formatDuration(currentTime)} dari ${formatDuration(duration)}`}
                className="flex-1 h-1.5 bg-[#14201a] rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:bg-[#1a2b23] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
              <span className="w-8 tabular-nums select-none">{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Volume, Fullscreen & Extras */}
          <div className="relative flex items-center justify-end gap-2.5 w-auto md:w-1/4">
            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="p-2 text-slate-400 hover:text-emerald-300 hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Buka tampilan fullscreen"
              aria-label="Buka tampilan fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Mobile Popover Volume Slider */}
            {showMobileVolume && (
              <div
                role="group"
                aria-label="Pengaturan volume mobile"
                className="md:hidden absolute bottom-full mb-3 right-0 bg-[#0f1713] border border-white/[0.1] rounded-2xl p-3 shadow-2xl flex items-center gap-3 backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1 text-slate-400 hover:text-white rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  title={isMuted || volume === 0 ? "Batal Bisukan Suara" : "Bisukan Suara"}
                  aria-label={isMuted || volume === 0 ? "Batal Bisukan Suara" : "Bisukan Suara"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  aria-label="Volume audio mobile"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round((isMuted ? 0 : volume) * 100)}
                  aria-valuetext={`${Math.round((isMuted ? 0 : volume) * 100)} persen`}
                  className="w-28 h-1.5 bg-[#14201a] rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:bg-[#1a2b23] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                />
                <span className="text-[10px] font-mono text-slate-400 w-7 text-right select-none">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>
            )}

            {/* Mobile Toggle Button */}
            <button
              type="button"
              onClick={() => setShowMobileVolume((prev) => !prev)}
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Buka slider volume"
              aria-label="Buka slider volume"
              aria-expanded={showMobileVolume}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 text-emerald-400" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            {/* Desktop Permanent Volume Slider */}
            <div className="hidden md:flex items-center gap-2.5">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                title={isMuted || volume === 0 ? "Batal Bisukan Suara" : "Bisukan Suara"}
                aria-label={isMuted || volume === 0 ? "Batal Bisukan Suara" : "Bisukan Suara"}
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
                aria-label="Volume audio"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round((isMuted ? 0 : volume) * 100)}
                aria-valuetext={`${Math.round((isMuted ? 0 : volume) * 100)} persen`}
                className="w-24 lg:w-28 h-1.5 bg-[#14201a] rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:bg-[#1a2b23] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
              <span className="text-[11px] font-mono text-slate-400 w-8 select-none">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
