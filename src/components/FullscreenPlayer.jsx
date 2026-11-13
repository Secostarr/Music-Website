import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Repeat2,
  Volume2, VolumeX, Minimize2, Music2, Disc3, Heart, Loader2, ExternalLink,
} from "lucide-react";
import { fetchLyrics, formatDuration } from "../services/musicApi";
import { useAudio } from "../context/AudioContext";
import { useAuth } from "../context/AuthContext";

export default function FullscreenPlayer({ isOpen, onClose }) {
  const [lyrics, setLyrics] = useState(null);
  const [lyricsError, setLyricsError] = useState(false);
  const lyricsContainerRef = useRef(null);
  const activeLineRef = useRef(null);
  const timedLyrics = useMemo(() => Array.isArray(lyrics?.lyrics) ? lyrics.lyrics : [], [lyrics]);
  const {
    currentTrack, isPlaying, currentTime, duration, volume, isMuted, isLoading,
    isShuffle, repeatMode, isLoopSegment, togglePlay, seek, setVolume, toggleMute,
    toggleLoopSegment, nextTrack, prevTrack, toggleShuffle, toggleRepeat,
  } = useAudio();
  const { isTrackSaved, toggleSaveTrack } = useAuth();

  useEffect(() => {
    if (!isOpen || currentTrack?.source !== "youtube" || !currentTrack.videoId) return undefined;
    const controller = new AbortController();
    setLyrics(null);
    setLyricsError(false);
    const loadLyrics = async () => {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const result = await fetchLyrics(currentTrack.videoId, { signal: controller.signal });
          const found = Array.isArray(result?.lyrics)
            ? result.lyrics.length > 0
            : typeof result?.lyrics === "string" && result.lyrics.trim().length > 0;
          if (found) { setLyrics(result); return; }
        } catch (error) {
          if (error.name === "AbortError") return;
        }
        if (attempt === 0) await new Promise((resolve) => window.setTimeout(resolve, 700));
      }
      setLyricsError(true);
    };
    loadLyrics();
    return () => controller.abort();
  }, [isOpen, currentTrack?.videoId, currentTrack?.source]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const activeIndex = useMemo(() => {
    if (!timedLyrics.length) return -1;
    const currentMs = currentTime * 1000;
    // Cari index baris lirik yang sedang berjalan
    let idx = -1;
    for (let i = 0; i < timedLyrics.length; i += 1) {
      const line = timedLyrics[i];
      const start = Number(line.startTime ?? line.start_time ?? 0);
      const next = timedLyrics[i + 1];
      const end = next ? Number(next.startTime ?? next.start_time ?? 0) : Number(line.endTime ?? line.end_time ?? start + 6000);
      if (currentMs >= start && currentMs < end) {
        idx = i;
        break;
      }
      if (currentMs >= start) {
        idx = i;
      }
    }
    return idx;
  }, [timedLyrics, currentTime]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0 || !activeLineRef.current || !lyricsContainerRef.current) return;
    const container = lyricsContainerRef.current;
    const line = activeLineRef.current;
    // Scroll hanya container lirik, bukan halaman — posisikan baris aktif di tengah container
    const lineHeight = line.offsetHeight;
    const containerHeight = container.clientHeight;
    // offsetTop bisa relatif ke parent langsung, bukan container — hitung secara manual
    const lineRect = line.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const relativeTop = lineRect.top - containerRect.top + container.scrollTop;
    const targetTop = activeIndex === 0
      ? 0
      : relativeTop - containerHeight / 2 + lineHeight / 2;
    container.scrollTo({
      top: Math.max(0, Math.min(targetTop, container.scrollHeight - containerHeight)),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, [isOpen, activeIndex]);

  if (!isOpen || !currentTrack) return null;
  const artwork = currentTrack.artwork || `https://i.ytimg.com/vi/${currentTrack.videoId}/maxresdefault.jpg`;
  const isSaved = isTrackSaved(currentTrack.id);

  return (
    <div role="dialog" aria-modal="true" aria-label="Pemutar musik layar penuh" className="fixed inset-0 z-[100] flex h-dvh flex-col overflow-hidden bg-[#080a09] text-white selection:bg-emerald-300/30">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_22%_8%,rgba(14,115,75,.28),transparent_42%),radial-gradient(ellipse_at_85%_90%,rgba(105,62,27,.18),transparent_42%)]" />
      <header className="relative z-10 flex shrink-0 items-center justify-between px-5 py-4 sm:px-9">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-300"><Music2 size={19} /></div>
          <div><p className="text-[10px] font-semibold uppercase tracking-[.25em] text-emerald-300">IramaNusantara</p><p className="text-xs text-white/45">Now playing</p></div>
        </div>
        <button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-xs text-white/70 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"><Minimize2 size={14} className="mr-2 inline" />Tutup <span className="hidden sm:inline">(Esc)</span></button>
      </header>

      <main className="relative z-10 mx-auto grid min-h-0 w-full max-w-[1440px] flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-3 overflow-hidden px-3 pb-3 sm:gap-5 sm:px-9 sm:pb-6 lg:grid-cols-[minmax(320px,460px)_1fr] lg:grid-rows-1 lg:gap-14 lg:px-14 lg:pb-8">
        {/* Mobile: compact metadata strip; desktop: full cover and controls column */}
        <section className="flex min-h-0 flex-col justify-between overflow-hidden lg:overflow-visible">
          <div className="flex min-h-0 items-center gap-3 lg:block">
            <div className="relative aspect-square w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#121715] shadow-lg sm:w-20 lg:mx-auto lg:aspect-square lg:w-full lg:max-w-[380px] lg:rounded-[1.4rem]">
              {artwork ? <img src={artwork} alt={`Sampul ${currentTrack.title}`} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <div className="grid h-full place-items-center text-white/20"><Disc3 size={74} /></div>}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-white/[.04]" />
              <div className="absolute bottom-2 left-2 right-2 hidden items-end justify-between lg:flex lg:bottom-4 lg:left-4 lg:right-4">
                <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-[.2em] text-white/75 backdrop-blur">Irama • Nusantara</span>
                <button type="button" onClick={() => toggleSaveTrack(currentTrack)} aria-label={isSaved ? "Hapus lagu tersimpan" : "Simpan lagu"} className={`grid h-10 w-10 place-items-center rounded-full border backdrop-blur transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 ${isSaved ? "border-emerald-300/40 bg-emerald-400 text-black" : "border-white/20 bg-black/45 text-white"}`}><Heart size={18} className={isSaved ? "fill-current" : ""} /></button>
              </div>
            </div>

            <div className="min-w-0 flex-1 lg:mt-4 lg:flex-none">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h1 className="truncate text-sm font-bold tracking-tight sm:text-base lg:text-2xl">{currentTrack.title}</h1>
                  <p className="truncate text-xs text-emerald-300 lg:mt-1 lg:text-sm">{currentTrack.artist}</p>
                  {currentTrack.album && <p className="hidden truncate text-xs text-white/45 lg:mt-1 lg:block">{currentTrack.album}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {currentTrack.link && <a href={currentTrack.link} target="_blank" rel="noreferrer" aria-label="Buka sumber lagu" className="rounded-full p-2 text-white/45 hover:bg-white/10 hover:text-white"><ExternalLink size={15} /></a>}
                  <button type="button" onClick={() => toggleSaveTrack(currentTrack)} aria-label={isSaved ? "Hapus lagu tersimpan" : "Simpan lagu"} className={`grid h-9 w-9 place-items-center rounded-full border lg:hidden ${isSaved ? "border-emerald-300/40 bg-emerald-400 text-black" : "border-white/15 text-white"}`}><Heart size={16} className={isSaved ? "fill-current" : ""} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Bar di bawah Album */}
          <div className="mt-2 shrink-0 rounded-xl border border-white/10 bg-white/[.03] p-2 backdrop-blur-md sm:p-3 lg:mt-4 lg:rounded-2xl lg:p-4">
            <div className="flex items-center gap-2 text-[9px] tabular-nums text-white/45 sm:gap-3 sm:text-xs">
              <span className="w-8 text-right">{formatDuration(currentTime)}</span>
              <input type="range" min="0" max={duration || 30} step="0.1" value={currentTime} onChange={(event) => seek(parseFloat(event.target.value))} aria-label="Posisi pemutaran lagu" className="h-1.5 flex-1 cursor-pointer accent-emerald-400" />
              <span className="w-8">{formatDuration(duration)}</span>
            </div>

            <div className="mt-2 flex items-center justify-between sm:mt-3">
              <div className="flex items-center gap-1.5 sm:gap-3">
                <button type="button" onClick={toggleShuffle} aria-label="Acak lagu" className={isShuffle ? "text-emerald-300" : "text-white/50 hover:text-white"}><Shuffle size={16} /></button>
                <button type="button" onClick={toggleRepeat} aria-label="Mode ulang" className={repeatMode !== "off" ? "text-emerald-300" : "text-white/50 hover:text-white"}>{repeatMode === "one" ? <Repeat1 size={16} /> : <Repeat size={16} />}</button>
                <button type="button" onClick={toggleLoopSegment} aria-label="Ulangi segmen" className={isLoopSegment ? "text-emerald-300" : "text-white/35 hover:text-white"}><Repeat2 size={16} /></button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button type="button" onClick={prevTrack} aria-label="Lagu sebelumnya" className="text-white/65 hover:text-white"><SkipBack size={17} fill="currentColor" /></button>
                <button type="button" onClick={togglePlay} aria-label={isPlaying ? "Jeda" : "Putar"} className="grid h-9 w-9 place-items-center rounded-full bg-emerald-400 text-black shadow-[0_0_20px_rgba(52,211,153,.4)] transition hover:scale-105 disabled:opacity-60 sm:h-11 sm:w-11" disabled={isLoading}>{isLoading ? <Loader2 size={17} className="animate-spin" /> : isPlaying ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}</button>
                <button type="button" onClick={nextTrack} aria-label="Lagu berikutnya" className="text-white/65 hover:text-white"><SkipForward size={17} fill="currentColor" /></button>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" onClick={toggleMute} aria-label={isMuted ? "Nyalakan suara" : "Bisukan suara"} className="text-white/50 hover:text-white">{isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
                <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={(event) => setVolume(parseFloat(event.target.value))} aria-label="Volume" className="w-14 cursor-pointer accent-emerald-400 sm:w-18" />
              </div>
            </div>
          </div>
        </section>

        {/* Kolom Kanan: Full Lirik Sync */}
        <section className="flex min-h-0 flex-col overflow-hidden border-t border-white/10 pt-2 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0" aria-label="Lirik lagu" aria-live="polite">
          <div className="mb-4 flex shrink-0 items-center gap-3">
            <span className="h-4 w-1 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.6)]" />
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[.24em] text-white/80">Lirik</h2>
              <p className="text-[10px] text-white/40">Sinkron otomatis dengan lagu</p>
            </div>
          </div>

          {timedLyrics.length ? (
            <div
              ref={lyricsContainerRef}
              className="relative h-full min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain pb-[40vh] pt-6 [scrollbar-color:rgba(255,255,255,.2)_transparent] [scrollbar-width:thin] [mask-image:linear-gradient(to_bottom,transparent,black_6%,black_90%,transparent)]"
            >
              {timedLyrics.map((line, index) => {
                const startTime = Number(line.startTime ?? line.start_time ?? 0);
                const active = index === activeIndex;
                const text = line.text ?? line.lyricLine ?? "";
                if (!text.trim()) return null;

                return (
                  <p
                    key={line.id ?? index}
                    ref={active ? activeLineRef : null}
                    onClick={() => seek(startTime / 1000)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") seek(startTime / 1000); }}
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-[opacity,transform,color,background] duration-500 ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                      active
                        ? "scale-[1.02] bg-white/[.07] font-bold text-white shadow-[0_8px_32px_rgba(0,0,0,.25)]"
                        : "font-medium text-white/35 hover:bg-white/[.03] hover:text-white/75"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-2.5 w-2.5 shrink-0 rounded-full transition-all duration-300 ${
                        active
                          ? "scale-125 bg-emerald-300 shadow-[0_0_14px_rgba(52,211,153,.9)] animate-pulse"
                          : "bg-transparent group-hover:bg-white/20"
                      }`}
                    />
                    <span className={`text-xl leading-relaxed tracking-tight transition-[font-size,filter] duration-500 sm:text-2xl lg:text-3xl ${active ? "drop-shadow-[0_0_20px_rgba(255,255,255,.2)]" : ""}`}>
                      {text}
                    </span>
                  </p>
                );
              })}
            </div>
          ) : typeof lyrics?.lyrics === "string" && lyrics.lyrics.trim() ? (
            <div className="h-full min-h-0 flex-1 overflow-y-auto whitespace-pre-line py-4 text-lg font-medium leading-[1.8] text-white/80 [scrollbar-width:thin] sm:text-xl">
              {lyrics.lyrics}
            </div>
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center gap-3 text-sm text-white/50">
              {lyricsError ? <><Music2 size={19} className="text-emerald-300" /><span>Lirik belum tersedia dari sumber API untuk lagu ini.</span></> : <><Loader2 size={18} className="animate-spin text-emerald-300" /><span>Mencari lirik lagu…</span></>}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
