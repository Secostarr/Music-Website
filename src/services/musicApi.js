// Layanan Music API berbasis Deezer (Lagu-lagu hits populer dunia & lokal)
const BASE_PROXY = "/api/deezer";
const CORS_FALLBACK = "https://corsproxy.io/?url=https://api.deezer.com";

export const GENRE_PRESETS = [
  { name: "Top Hits Global", query: "top hits" },
  { name: "Indonesian Hits", query: "indonesia hits" },
  { name: "Pop", query: "pop hits" },
  { name: "K-Pop", query: "kpop" },
  { name: "Hip-Hop / Rap", query: "hip hop hits" },
  { name: "Rock", query: "rock classics" },
  { name: "R&B", query: "r&b hits" },
  { name: "EDM", query: "edm dance" },
  { name: "Chill / Acoustic", query: "acoustic chill" },
  { name: "Anime", query: "anime soundtrack" }
];

async function apiFetch(endpoint) {
  // Coba via Vite local proxy terlebih dahulu
  try {
    const res = await fetch(`${BASE_PROXY}${endpoint}`);
    if (res.ok) {
      const data = await res.json();
      if (data && !data.error) return data;
    }
  } catch (err) {
    // Ignore and fallback
  }

  // Fallback jika proxy lokal tidak aktif / saat production
  try {
    const fallbackUrl = `${CORS_FALLBACK}${encodeURIComponent(endpoint)}`;
    const res = await fetch(fallbackUrl);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Gagal fetch musik:", err);
  }

  return null;
}

// Ambil chart / top tracks terpopuler
export async function fetchTopCharts() {
  const result = await apiFetch("/chart");
  if (result?.tracks?.data) {
    return result.tracks.data.map(formatDeezerTrack);
  }
  // Jika gagal chart, fallback ke search top hits
  return searchTracks("top hits 2024");
}

// Cari lagu berdasarkan query teks atau genre preset
export async function searchTracks(query) {
  if (!query || query.trim() === "") return fetchTopCharts();
  const result = await apiFetch(`/search?q=${encodeURIComponent(query)}&limit=50`);
  if (result?.data) {
    return result.data.map(formatDeezerTrack);
  }
  return [];
}

// Standardisasi format data lagu
function formatDeezerTrack(item) {
  return toUnifiedTrack(item);
}

/**
 * Adapter untuk mengubah entitas item Deezer API menjadi format UnifiedTrack.
 * Mempertahankan properti lama (previewUrl, album, rank, dll.) demi kompatibilitas ke belakang.
 *
 * @param {any} item - Raw object lagu dari respons Deezer
 * @returns {import("../data/viralSounds").UnifiedTrack}
 */
export function toUnifiedTrack(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const rawId = item.id != null ? String(item.id) : String(Date.now());
  const id = rawId.startsWith("dz-") ? rawId : `dz-${rawId}`;
  const title = item.title_short || item.title || "Untitled";
  const artist = item.artist?.name || "Unknown Artist";
  const artwork = item.album?.cover_big || item.album?.cover_medium || item.album?.cover || "";
  const audioUrl = typeof item.preview === "string" ? item.preview : "";
  const fullDuration = typeof item.duration === "number" && item.duration > 0 ? item.duration : 30;
  // Durasi preview audio Deezer adalah 30 detik (atau durasi lagu jika lebih pendek)
  const previewDuration = Math.min(30, fullDuration);

  return {
    // Kontrak UnifiedTrack
    id,
    source: "deezer",
    type: "preview",
    title,
    artist,
    artwork,
    audioUrl,
    duration: fullDuration,
    previewDuration,
    segmentStart: 0,
    segmentEnd: previewDuration,
    isLoopable: false,
    attribution: "Deezer Preview Catalog",
    sourceUrl: item.link || "https://www.deezer.com",
    viralMeta: null,

    // Properti kompatibilitas dengan komponen eksisting
    previewUrl: audioUrl,
    album: item.album?.title || "",
    artistPicture: item.artist?.picture_medium || "",
    rank: item.rank || 0,
    link: item.link || ""
  };
}

export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
