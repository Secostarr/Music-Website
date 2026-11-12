import React from "react";
import { Heart, Music2, Play, Pause } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAudio } from "../context/AudioContext";
import { formatDuration } from "../services/musicApi";

export default function SavedTracksPanel({ onClose, onPlayTrack }) {
  const { user, savedTracks, toggleSaveTrack, openAuthModal } = useAuth();
  const { currentTrack, isPlaying } = useAudio();

  if (!user) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-[#0f1713] border border-white/[0.1] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <Heart className="w-12 h-12 text-emerald-400/50 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">Koleksi Musik Kamu</h3>
          <p className="text-sm text-slate-400 mt-2 mb-6">
            Masuk untuk melihat dan mengelola lagu-lagu yang kamu simpan.
          </p>
          <button
            type="button"
            onClick={() => { onClose(); openAuthModal("login"); }}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm cursor-pointer hover:scale-105 transition-all"
          >
            Masuk Sekarang
          </button>
          <button
            type="button"
            onClick={onClose}
            className="block mt-3 mx-auto text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
          >
            Nanti saja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Lagu Tersimpan"
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-gradient-to-b from-[#14231b] to-[#0a0f0d] border border-white/[0.1] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-emerald-400 fill-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Lagu Tersimpan</h2>
              <p className="text-xs text-slate-400">{savedTracks.length} lagu</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

        {/* Track List */}
        <div className="overflow-y-auto flex-1 p-4 space-y-1.5 [scrollbar-width:thin]">
          {savedTracks.length === 0 ? (
            <div className="text-center py-16">
              <Music2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-300">Belum ada lagu tersimpan</p>
              <p className="text-xs text-slate-500 mt-1">
                Klik ikon ❤ pada lagu untuk menyimpannya ke sini.
              </p>
            </div>
          ) : (
            savedTracks.map((track) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  className={`group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                    isCurrent
                      ? "bg-[#14201a] border-emerald-500/30"
                      : "bg-transparent hover:bg-white/[0.04] border-transparent"
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={() => onPlayTrack(track)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPlayTrack(track); }}}
                  aria-label={`${track.title} oleh ${track.artist}`}
                >
                  {/* Artwork */}
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-[#060907] border border-white/[0.06]">
                    {track.artwork ? (
                      <img src={track.artwork} alt={track.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music2 className="w-5 h-5 text-slate-600" />
                      </div>
                    )}
                    <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                      {isCurrent && isPlaying
                        ? <Pause className="w-4 h-4 text-white fill-white" />
                        : <Play className="w-4 h-4 text-white fill-white translate-x-0.5" />}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isCurrent ? "text-emerald-300" : "text-slate-100"}`}>{track.title}</p>
                    <p className="text-xs text-slate-400 truncate">{track.artist}</p>
                  </div>

                  {/* Duration + Remove */}
                  <div className="flex items-center gap-2 shrink-0">
                    {track.duration > 0 && (
                      <span className="text-[11px] font-mono text-slate-500">{formatDuration(track.duration)}</span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleSaveTrack(track); }}
                      aria-label="Hapus dari koleksi"
                      className="p-1.5 rounded-lg text-emerald-400 hover:text-red-400 hover:bg-red-950/20 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
