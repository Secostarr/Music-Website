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

export async function fetchLyrics(videoId, { signal } = {}) {
  const params = new URLSearchParams({ videoId });
  const response = await fetch(`/api/music/search?${params}`, { signal });
  if (!response.ok) throw new Error("Lirik lagu tidak dapat dimuat.");
  const data = await response.json();
  return data.lyrics || {};
}

async function requestTracks(query = "") {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  const response = await fetch(`/api/music/search${params.size ? `?${params}` : ""}`);
  if (!response.ok) throw new Error("Katalog musik tidak dapat dimuat.");
  const data = await response.json();
  return Array.isArray(data.tracks) ? data.tracks : [];
}

export const fetchTopCharts = () => requestTracks();
export const searchTracks = (query) => requestTracks(query || "");

export function toUnifiedTrack(item) {
  if (!item || typeof item !== "object") return null;
  const rawId = item.id != null ? String(item.id) : String(Date.now());
  const id = rawId.startsWith("dz-") ? rawId : `dz-${rawId}`;
  const title = item.title_short || item.title || "Untitled";
  const artist = item.artist?.name || "Unknown Artist";
  const artwork = item.album?.cover_big || item.album?.cover_medium || item.album?.cover || "";
  const audioUrl = typeof item.preview === "string" ? item.preview : "";
  const fullDuration = typeof item.duration === "number" && item.duration > 0 ? item.duration : 30;
  const previewDuration = Math.min(30, fullDuration);

  return {
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
    previewUrl: audioUrl,
    album: item.album?.title || "",
    artistPicture: item.artist?.picture_medium || "",
    rank: item.rank || 0,
    link: item.link || "",
  };
}

export function formatDuration(seconds) {
  if (!seconds || Number.isNaN(seconds)) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}
