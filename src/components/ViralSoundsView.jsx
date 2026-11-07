import React, { useMemo } from "react";
import { Flame, Sparkles, Music2, ShieldCheck, Clock } from "lucide-react";
import ViralSoundCard from "./ViralSoundCard";
import { curatedViralSounds, isValidUnifiedTrack } from "../data/viralSounds";
import { useAudio } from "../context/AudioContext";

/**
 * Tampilan katalog Reff Viral / TikTok Sound Quotes.
 * Hanya menampilkan track yang valid dan memiliki status verifikasi legal "verified".
 */
export default function ViralSoundsView() {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  // Filter ketat katalog publik: hanya track curated yang sah dan lolos verifikasi legal
  const verifiedSounds = useMemo(() => {
    return curatedViralSounds.filter(
      (track) =>
        isValidUnifiedTrack(track) &&
        track.legalMeta?.verificationStatus === "verified"
    );
  }, []);

  const handlePlaySound = (track) => {
    // Validasi ulang sebelum memutar audio
    if (!isValidUnifiedTrack(track) || track.legalMeta?.verificationStatus !== "verified") {
      console.warn("Track tidak memenuhi standar kurasi legal:", track);
      return;
    }

    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, verifiedSounds);
    }
  };

  const hasSounds = verifiedSounds.length > 0;

  return (
    <section
      id="panel-viral"
      role="tabpanel"
      aria-labelledby="tab-viral"
      className="flex flex-col gap-6"
    >
      {/* Header Banner Reff Viral */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#141724] via-[#0f111a] to-[#090a0f] border border-white/[0.08] p-6 sm:p-8 shadow-2xl transition-all">
        {/* Ambient Glow */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-3 tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5 text-purple-400" />
            Curated Hook & Viral Sounds
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Reff Viral & Quotes
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Koleksi cuplikan hook pilihan untuk inspirasi audio dan quotes.
            Dilengkapi pemutar segmen loop terpusat yang mulus dan bebas jeda.
          </p>
        </div>
      </div>

      {/* Grid Katalog atau Empty State */}
      {hasSounds ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {verifiedSounds.map((track) => (
            <ViralSoundCard
              key={track.id}
              track={track}
              isCurrent={currentTrack?.id === track.id}
              isPlaying={isPlaying}
              onPlayTrack={handlePlaySound}
            />
          ))}
        </div>
      ) : (
        /* Empty State yang jujur, informatif & profesional */
        <div className="flex flex-col items-center justify-center p-8 sm:p-14 rounded-3xl bg-[#0f111a]/70 border border-white/[0.07] text-center my-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#141724] border border-purple-500/30 flex items-center justify-center mb-5 text-purple-400 shadow-lg shadow-purple-950/30">
            <Music2 className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-100 mb-2 tracking-tight">
            Katalog Reff Viral Sedang Disiapkan
          </h3>
          <p className="text-sm text-slate-400 max-w-lg leading-relaxed mb-8">
            Katalog cuplikan reff dan sound quotes sedang dalam proses persiapan. Kami menerapkan kebijakan hak cipta ketat yang mewajibkan kepemilikan orisinal atau izin tertulis terverifikasi sebelum audio ditayangkan.
            Silakan nikmati katalog resmi di tab <span className="text-slate-200 font-medium">Katalog Hits</span> untuk saat ini.
          </p>

          {/* Feature Highlight Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141724]/80 border border-white/[0.08] text-slate-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Seamless Segment Loop</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141724]/80 border border-white/[0.08] text-slate-300 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Quotes & Mood Hook</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141724]/80 border border-white/[0.08] text-slate-300 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Verified Rights Policy</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
