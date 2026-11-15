import React, { useState } from "react";
import { curatedViralSounds, ALLOWED_VIRAL_CATEGORIES } from "../data/viralSounds";
import ViralSoundCard from "./ViralSoundCard";
import { ShieldCheck, Sparkles, Clock } from "lucide-react";

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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1d1915] via-[#15120f] to-[#080706] border border-white/[0.08] p-6 sm:p-8 mb-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h2 className="font-display uppercase text-2xl sm:text-4xl leading-[1.05] tracking-tight text-stone-100">
            Reff Viral & Quotes Sound
          </h2>
          <p className="text-sm text-stone-300 mt-2 leading-relaxed">
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
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9141f] ${
                isSelected
                  ? "bg-[#d9141f] text-white shadow-md shadow-[#59060b]/40 border border-[#ef2430]/40"
                  : "bg-[#15120f]/80 hover:bg-[#1d1915] text-stone-400 hover:text-stone-200 border border-white/[0.06]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Empty State Terkurasi & Jujur */}
      {filteredSounds.length === 0 && (
        <div className="text-center py-16 px-4 rounded-2xl bg-[#15120f]/40 border border-white/[0.06] max-w-2xl mx-auto my-6">
          <div className="w-16 h-16 rounded-xl bg-[#1d1915] border border-white/[0.1] flex items-center justify-center mx-auto mb-5 text-stone-400 shadow-lg shadow-[#59060b]/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-100 mb-2">
            Katalog Sedang Dalam Proses Kurasi Legal
          </h3>
          <p className="text-sm text-stone-400 leading-relaxed max-w-md mx-auto mb-6">
            Kami menerapkan kepatuhan hak cipta yang ketat. Hanya audio orisinal kreator atau materi
            dengan izin tertulis resmi yang akan ditampilkan di sini.
          </p>
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-stone-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              Verifikasi UTC Aktif
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-stone-500" />
              Segment Looping Siap
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
              Bebas Pelanggaran Hak Cipta
            </span>
          </div>
        </div>
      )}

      {/* Grid Kartu Suara Viral (Saat data terkurasi tersedia) */}
      {filteredSounds.length > 0 && (
        <div className="no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-3 overflow-x-auto overscroll-x-contain snap-x snap-mandatory md:flex-wrap md:justify-center md:gap-4 md:overflow-visible">
          {filteredSounds.map((sound) => (
            <ViralSoundCard key={sound.id} sound={sound} />
          ))}
        </div>
      )}
    </section>
  );
}
