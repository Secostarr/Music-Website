import React, { useState } from "react";
import { curatedViralSounds, ALLOWED_VIRAL_CATEGORIES } from "../data/viralSounds";
import ViralSoundCard from "./ViralSoundCard";
import { Flame, ShieldCheck, Sparkles, Clock } from "lucide-react";

export default function ViralSoundsView() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = ["Semua", ...ALLOWED_VIRAL_CATEGORIES];

  const filteredSounds = curatedViralSounds.filter((sound) => {
    if (selectedCategory === "Semua") return true;
    return sound.viralMeta?.category === selectedCategory;
  });

  return (
    <section
      id="panel-viral"
      role="tabpanel"
      aria-labelledby="tab-viral"
      className="w-full transition-opacity duration-300"
    >
      {/* Editorial Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#14201a] via-[#0f1713] to-[#060907] border border-white/[0.08] p-6 sm:p-8 mb-8 shadow-2xl">
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-3 tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5 text-emerald-400" /> Kurasi Reff & Quotes
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Reff Viral & Quotes Sound
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Koleksi potongan hook reff viral, quotes TikTok, dan sound atmosferik.
            Setiap audio dalam katalog ini wajib memiliki izin tertulis atau merupakan karya orisinal
            yang terverifikasi secara hukum.
          </p>
        </div>
      </div>

      {/* Filter Kategori Viral */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isSelected
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-950/40 border border-emerald-400/40"
                  : "bg-[#0f1713]/80 hover:bg-[#14201a] text-slate-400 hover:text-slate-200 border border-white/[0.06]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Empty State Terkurasi & Jujur */}
      {filteredSounds.length === 0 && (
        <div className="text-center py-16 px-4 rounded-3xl bg-[#0f1713]/40 border border-white/[0.06] max-w-2xl mx-auto my-6">
          <div className="w-16 h-16 rounded-2xl bg-[#14201a] border border-emerald-500/30 flex items-center justify-center mx-auto mb-5 text-emerald-400 shadow-lg shadow-emerald-950/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-2">
            Katalog Sedang Dalam Proses Kurasi Legal
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto mb-6">
            Kami menerapkan kepatuhan hak cipta yang ketat. Hanya audio orisinal kreator atau materi
            dengan izin tertulis resmi yang akan ditampilkan di sini.
          </p>
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Verifikasi UTC Aktif
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Segment Looping Siap
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Bebas Pelanggaran Hak Cipta
            </span>
          </div>
        </div>
      )}

      {/* Grid Kartu Suara Viral (Saat data terkurasi tersedia) */}
      {filteredSounds.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSounds.map((sound) => (
            <ViralSoundCard key={sound.id} sound={sound} />
          ))}
        </div>
      )}
    </section>
  );
}
