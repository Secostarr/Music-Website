const APP_NAME = "MyWebMusic";
const BASE_URL = "https://discoveryprovider.audius.co/v1";

export const GENRES = [
  "All",
  "Electronic",
  "Hip-Hop/Rap",
  "Pop",
  "Rock",
  "Alternative",
  "R&B/Soul",
  "Ambient",
  "Lo-Fi",
  "Jazz",
  "Acoustic"
];

export async function fetchTrendingTracks(genre = "All") {
  try {
    let url = `${BASE_URL}/tracks/trending?app_name=${APP_NAME}`;
    if (genre && genre !== "All") {
      url += `&genre=${encodeURIComponent(genre)}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal mengambil data trending");
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetch trending:", error);
    return [];
  }
}

export async function searchTracks(query) {
  if (!query || query.trim() === "") return [];
  try {
    const url = `${BASE_URL}/tracks/search?query=${encodeURIComponent(query)}&app_name=${APP_NAME}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal mencari lagu");
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error("Error search tracks:", error);
    return [];
  }
}

export function getStreamUrl(trackId) {
  return `${BASE_URL}/tracks/${trackId}/stream?app_name=${APP_NAME}`;
}

export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
