from http.server import BaseHTTPRequestHandler
import json
import re
import urllib.parse
import urllib.request
from ytmusicapi import YTMusic


def lyrics_from_lrclib(title, artist):
    params = urllib.parse.urlencode({"track_name": title, "artist_name": artist})
    request = urllib.request.Request(
        f"https://lrclib.net/api/get?{params}",
        headers={"User-Agent": "IramaNusantara/1.0 (lyrics lookup)"},
    )
    try:
        with urllib.request.urlopen(request, timeout=5) as response:
            data = json.loads(response.read().decode("utf-8"))
    except Exception:
        return {}
    synced = data.get("syncedLyrics") or ""
    plain = data.get("plainLyrics") or ""
    lines = []
    for match in re.finditer(r"\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)", synced):
        minutes, seconds, fraction, text = match.groups()
        start = (int(minutes) * 60 + int(seconds)) * 1000 + int(fraction.ljust(3, "0")[:3])
        lines.append({"start_time": start, "text": text.strip()})
    timed = [{
        "id": index,
        "start_time": line["start_time"],
        "end_time": lines[index + 1]["start_time"] if index + 1 < len(lines) else line["start_time"] + 5000,
        "lyricLine": line["text"],
        "text": line["text"],
    } for index, line in enumerate(lines) if line["text"]]
    if timed:
        return {"lyrics": timed, "source": "lrclib", "plainLyrics": plain}
    return {"lyrics": plain.strip(), "source": "lrclib"} if plain.strip() else {}


def get_lyrics(video_id, yt):
    title, artist = "", ""
    try:
        watch = yt.get_watch_playlist(videoId=video_id)
        title = watch.get("title", "")
        artist = ", ".join(a.get("name", "") for a in watch.get("artists", []) if a.get("name"))
        browse_id = watch.get("lyrics")
        if browse_id:
            lyrics = yt.get_lyrics(browse_id, timestamps=True)
            if lyrics:
                return lyrics
    except Exception:
        pass
    try:
        results = yt.search(video_id, filter="songs", limit=1)
        if results:
            song = results[0]
            title = song.get("title") or title
            artist = ", ".join(a.get("name", "") for a in (song.get("artists") or []) if a.get("name")) or artist
    except Exception:
        pass
    return lyrics_from_lrclib(title, artist) if title and artist else {}

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)

        video_id = params.get("videoId", [""])[0].strip()
        if video_id:
            self._send_json({"lyrics": get_lyrics(video_id, yt)})
            return

        query = params.get("q", [""])[0].strip() or "lagu pop indonesia terpopuler"
        try:
            items = yt.search(query, filter="songs", limit=30)
            tracks = []
            for item in items:
                v_id = item.get("videoId")
                if not v_id:
                    continue
                artists = item.get("artists") or []
                album = item.get("album") or {}
                thumbnails = item.get("thumbnails") or []
                artwork = thumbnails[-1].get("url", "") if thumbnails else ""
                if artwork:
                    artwork = artwork.replace("w60-h60", "w1200-h1200").replace("w120-h120", "w1200-h1200").replace("=w60-h60", "=w1200-h1200").replace("=w120-h120", "=w1200-h1200")
                tracks.append({
                    "id": v_id,
                    "source": "youtube",
                    "videoId": v_id,
                    "title": item.get("title") or "Unknown title",
                    "artist": ", ".join(a.get("name", "") for a in artists if a.get("name")) or "Unknown artist",
                    "album": album.get("name", ""),
                    "artwork": artwork,
                    "duration": item.get("duration_seconds") or 0,
                    "audioUrl": "",
                    "previewUrl": "",
                    "link": f"https://music.youtube.com/watch?v={v_id}",
                })
            self._send_json({"tracks": tracks})
        except Exception as e:
            self._send_json({"error": str(e), "tracks": []}, status=500)

    def _send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)
