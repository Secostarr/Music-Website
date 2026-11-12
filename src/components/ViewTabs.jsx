import React from "react";
import { Music2, Flame } from "lucide-react";

export default function ViewTabs({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: "music",
      label: "Hits Populer",
      icon: Music2,
      badge: "Chart",
      description: "Lagu-lagu hits global dan nasional resmi",
    },
    {
      id: "viral",
      label: "Reff Viral / Sound TikTok",
      icon: Flame,
      badge: "Quotes",
      description: "Sound pendek berizin & quotes tren",
    },
  ];

  const handleKeyDown = (e, targetTabId) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextTab = tabs.find((t) => t.id !== targetTabId);
      if (nextTab) onTabChange(nextTab.id);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prevTab = tabs.find((t) => t.id !== targetTabId);
      if (prevTab) onTabChange(prevTab.id);
    }
  };

  return (
    <div className="w-full mb-6">
      <div
        role="tablist"
        aria-label="Pilihan Katalog Musik"
        className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0f1713]/80 border border-white/[0.06] backdrop-blur-md max-w-fit"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isActive
                  ? "bg-[#14201a] text-slate-100 border border-emerald-500/30 shadow-md shadow-black/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-300"
                }`}
                aria-hidden="true"
              />
              <span>{tab.label}</span>

              {tab.badge && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-white/[0.05] text-slate-400 border border-white/[0.05]"
                  }`}
                >
                  {tab.badge}
                </span>
              )}

              {/* Active Indicator Underline */}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-2 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Aksesibilitas: info pendukung untuk screen-reader */}
      <div className="sr-only" aria-live="polite">
        {activeTab === "music"
          ? "Menampilkan katalog hits terpopuler saat ini."
          : "Menampilkan sound viral, quotes pendek, dan reff terkurasi legal."}
      </div>
    </div>
  );
}
