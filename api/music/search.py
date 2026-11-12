from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
from ytmusicapi import YTMusic

yt = YTMusic()

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)

        video_id = params.get("videoId", [""])[0].strip()
        if video_id:
            try:
                watch = yt.get_watch_playlist(videoId=video_id)
                browse_id = watch.get("lyrics")
                lyrics = yt.get_lyrics(browse_id, timestamps=True) if browse_id else None
                self._send_json({"lyrics": lyrics or {}})
            except Exception as e:
                self._send_json({"error": str(e), "lyrics": {}}, status=500)
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
                tracks.append({
                    "id": v_id,
                    "source": "youtube",
                    "videoId": v_id,
                    "title": item.get("title") or "Unknown title",
                    "artist": ", ".join(a.get("name", "") for a in artists if a.get("name")) or "Unknown artist",
                    "album": album.get("name", ""),
                    "artwork": thumbnails[-1].get("url", "") if thumbnails else "",
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
