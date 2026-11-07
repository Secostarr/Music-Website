import React, { useRef } from "react";
import { Music2, Flame } from "lucide-react";

const TABS = [
  { id: "music", label: "Katalog Hits", icon: Music2, panelId: "panel-music", tabId: "tab-music" },
  { id: "viral", label: "Reff Viral", icon: Flame, panelId: "panel-viral", tabId: "tab-viral", badge: "Quotes" }
];

/**
 * Tab navigasi utama antara Katalog Musik dan Reff Viral.
 * Mengimplementasikan pola WAI-ARIA Tabs dengan roving tabIndex dan keyboard navigation:
 * - ArrowLeft / ArrowRight untuk navigasi antar tab
 * - Home untuk tab pertama, End untuk tab terakhir
 *
 * @param {Object} props
 * @param {"music"|"viral"} props.activeTab - Tab yang sedang aktif
 * @param {(tab: "music"|"viral") => void} props.onTabChange - Handler pergantian tab
 */
export default function ViewTabs({ activeTab, onTabChange }) {
  const tabRefs = useRef({});

  const handleKeyDown = (e, index) => {
    let targetIndex = -1;

    if (e.key === "ArrowRight") {
      targetIndex = (index + 1) % TABS.length;
    } else if (e.key === "ArrowLeft") {
      targetIndex = (index - 1 + TABS.length) % TABS.length;
    } else if (e.key === "Home") {
      targetIndex = 0;
    } else if (e.key === "End") {
      targetIndex = TABS.length - 1;
    }

    if (targetIndex !== -1) {
      e.preventDefault();
      const targetTab = TABS[targetIndex];
      onTabChange(targetTab.id);
      tabRefs.current[targetTab.id]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Bagian aplikasi"
      className="flex items-center gap-2 border-b border-white/[0.07] mb-6 pb-2"
    >
      {TABS.map((tab, idx) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            role="tab"
            id={tab.tabId}
            aria-selected={isActive}
            aria-controls={tab.panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
              isActive
                ? "bg-[#141724] text-slate-100 border border-purple-500/30 shadow-md shadow-black/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-[#0f111a]/60 border border-transparent"
            }`}
          >
            <Icon
              className={`w-4 h-4 transition-colors ${
                isActive ? "text-purple-400" : "text-slate-400 group-hover:text-slate-300"
              }`}
            />
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`text-[10px] font-mono tracking-wider font-semibold px-2 py-0.5 rounded-full uppercase transition-colors ${
                  isActive
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "bg-[#0f111a] text-slate-400 border border-white/[0.06] group-hover:text-slate-300"
                }`}
              >
                {tab.badge}
              </span>
            )}

            {/* Subtle Active Indicator Underglow */}
            {isActive && (
              <span
                aria-hidden="true"
                className="absolute -bottom-2 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_8px_rgba(168,85,247,0.8)]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
