export const GENRE_PRESETS = [
  { name: "Hits Indonesia", query: "lagu pop indonesia terpopuler" },
  { name: "Dangdut & Koplo", query: "dangdut koplo terbaru terpopuler" },
  { name: "Pop Indo", query: "pop indonesia hits" },
  { name: "Indie Indo", query: "lagu indie indonesia" },
  { name: "Top Hits Global", query: "" },
  { name: "Barat Populer", query: "pop hits" },
  { name: "K-Pop", query: "kpop hits" },
  { name: "Hip-Hop / Rap", query: "hip hop hits" },
  { name: "Rock", query: "rock hits" },
  { name: "R&B / Soul", query: "r&b hits" },
  { name: "Akustik Santai", query: "akustik indonesia santai" },
];

// Base URL API: kosong = same-origin (dev proxy Vite / same host); set VITE_API_BASE saat SPA terpisah dari backend
const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function fetchLyrics(videoId, { signal } = {}) {
  const params = new URLSearchParams({ videoId });
  const response = await fetch(`${API_BASE}/api/music/search?${params}`, { signal });
  if (!response.ok) throw new Error("Lirik lagu tidak dapat dimuat.");
  const data = await response.json();
  return data.lyrics || {};
}

async function requestTracks(query = "") {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  const response = await fetch(`${API_BASE}/api/music/search${params.size ? `?${params}` : ""}`);
  if (!response.ok) throw new Error("Katalog musik tidak dapat dimuat.");
  const data = await response.json();
  return Array.isArray(data.tracks) ? data.tracks : [];
}

export const fetchTopCharts = () => requestTracks();
export const searchTracks = (query) => requestTracks(query || "");

export function formatDuration(seconds) {
  if (!seconds || Number.isNaN(seconds)) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

// Thumbnail video YouTube: maxres (1280x720) sering 404, sd lalu hq selalu ada.
// Index 2 = hqdefault, paling aman untuk ukuran kecil.
const YT_ART_SIZES = ["maxresdefault", "sddefault", "hqdefault"];

export function ytArtworkFor(track, sizeIndex = 2) {
  const id = track?.videoId;
  if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) return "";
  const name = YT_ART_SIZES[Math.min(Math.max(sizeIndex, 0), YT_ART_SIZES.length - 1)];
  return `https://i.ytimg.com/vi/${id}/${name}.jpg`;
}

// CDN menyimpan ukuran di URL ("...=w60-h60-l90-rp" atau ".../w60-h60"). Minta 1200px.
export function hdArtworkUrl(url) {
  if (typeof url !== "string" || !url) return "";
  return url.replace(/([=/])w\d+-h\d+/, "$1w1200-h1200");
}

export function artworkFor(track) {
  return hdArtworkUrl(typeof track?.artwork === "string" ? track.artwork.trim() : "") || ytArtworkFor(track, 2);
}

// Urutan sumber gambar: artwork HD → maxres → sd → hq. Melewati jumlah = placeholder.
export function artworkCandidates(track) {
  const raw = hdArtworkUrl(typeof track?.artwork === "string" ? track.artwork.trim() : "");
  const list = [raw, ytArtworkFor(track, 0), ytArtworkFor(track, 1), ytArtworkFor(track, 2)];
  return [...new Set(list.filter(Boolean))];
}
