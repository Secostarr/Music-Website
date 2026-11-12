import React from "react";
import { Flame, Play, Pause, Sparkles } from "lucide-react";
import { formatDuration } from "../services/musicApi";
import { useAudio } from "../context/AudioContext";

export default function RightPanel({ tracks, onPlayTrack }) {
  const { currentTrack, isPlaying } = useAudio();

  const trendingList = tracks.slice(1, 6);

  return (
    <aside
      aria-label="Panel Tren dan Rekomendasi"
      className="w-72 xl:w-80 shrink-0 hidden xl:flex flex-col gap-6 py-6 pr-6 pl-2"
    >
      {/* Top Hits Highlight Box */}
      <div className="rounded-3xl bg-[#0f1713]/80 border border-white/[0.08] p-5 shadow-xl relative overflow-hidden backdrop-blur-xl">
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"
        />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 tracking-tight">Top Charts</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            Live Streaming
          </span>
        </div>

        {trendingList.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Memuat daftar teratas...
          </div>
        ) : (
          <div className="space-y-2.5">
            {trendingList.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onPlayTrack(track)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onPlayTrack(track);
                    }
                  }}
                  className={`group flex items-center justify-between p-2 rounded-2xl cursor-pointer transition-all border focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    isCurrent
                      ? "bg-[#14201a] border-emerald-500/40 shadow-sm shadow-emerald-950/40"
                      : "bg-transparent hover:bg-white/[0.04] border-transparent"
                  }`}
                  aria-label={`${track.title} oleh ${track.artist}. ${isCurrent && isPlaying ? "Jeda" : "Putar"}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    {/* Rank index */}
                    <span className="text-xs font-mono font-bold text-slate-500 w-4 text-center">
                      #{idx + 2}
                    </span>

                    {/* Thumbnail */}
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-[#060907] border border-white/[0.06]">
                      <img
                        src={track.artwork || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60"}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Play overlay on hover */}
                      <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
                        isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}>
                        {isCurrent && isPlaying ? (
                          <Pause className="w-3.5 h-3.5 text-white fill-white" />
                        ) : (
                          <Play className="w-3.5 h-3.5 text-white fill-white translate-x-0.5" />
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-semibold truncate ${
                          isCurrent ? "text-emerald-300" : "text-slate-200 group-hover:text-emerald-300"
                        }`}
                        title={track.title}
                      >
                        {track.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate" title={track.artist}>
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {track.duration ? formatDuration(track.duration) : "0:30"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Audio Quality Box */}
      <div className="rounded-3xl bg-gradient-to-br from-[#14201a]/90 to-[#0f1713]/80 border border-white/[0.08] p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2 text-emerald-300">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold tracking-wide uppercase">Audio Quality</span>
        </div>
        <h4 className="text-sm font-semibold text-slate-100 mb-1.5">
          High Quality Audio
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Streaming musik lancar langsung dari pemutar web.
        </p>

        <div className="p-3 rounded-2xl bg-[#0a0f0d]/80 border border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Engine Status</span>
          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </div>
      </div>
    </aside>
  );
}
