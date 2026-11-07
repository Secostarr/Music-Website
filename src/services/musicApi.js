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
  return {
    id: item.id,
    title: item.title_short || item.title,
    artist: item.artist?.name || "Unknown Artist",
    artistPicture: item.artist?.picture_medium,
    album: item.album?.title || "",
    artwork: item.album?.cover_big || item.album?.cover_medium || item.album?.cover,
    previewUrl: item.preview, // URL audio resmi Deezer MP3
    duration: item.duration || 30,
    rank: item.rank || 0,
    link: item.link,
  };
}

export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
