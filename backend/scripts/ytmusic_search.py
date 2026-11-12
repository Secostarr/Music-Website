import json
import os
import socket
import sys

# Force utf-8 stdout so Windows default codepage (cp1252) does not crash on unicode characters in song titles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from ytmusicapi import YTMusic

# ponytail: Windows PHP child processes can inherit a broken DNS resolver; use a fresh OS lookup for YT Music only.
if sys.platform == "win32":
    addresses = socket.getaddrinfo
    socket.getaddrinfo = lambda host, port, *args, **kwargs: addresses(os.environ.get("YTMUSIC_RESOLVED_IP"), port, *args, **kwargs) if host == "music.youtube.com" and os.environ.get("YTMUSIC_RESOLVED_IP") else addresses(host, port, *args, **kwargs)

query = sys.argv[1].strip() if len(sys.argv) > 1 else ""
yt = YTMusic()
items = yt.search(query or "top songs", filter="songs", limit=30)
tracks = []
for item in items:
    video_id = item.get("videoId")
    if not video_id:
        continue
    artists = item.get("artists") or []
    album = item.get("album") or {}
    thumbnails = item.get("thumbnails") or []
    tracks.append({
        "id": video_id,
        "source": "youtube",
        "videoId": video_id,
        "title": item.get("title") or "Unknown title",
        "artist": ", ".join(artist.get("name", "") for artist in artists if artist.get("name")) or "Unknown artist",
        "album": album.get("name", ""),
        "artwork": thumbnails[-1].get("url", "") if thumbnails else "",
        "duration": item.get("duration_seconds") or 0,
        "lyricsBrowseId": item.get("lyrics", {}).get("browseId", "") if isinstance(item.get("lyrics"), dict) else "",
        "audioUrl": "",
        "previewUrl": "",
        "link": "https://music.youtube.com/watch?v=" + video_id,
    })
if len(sys.argv) > 2 and sys.argv[2] == "lyrics":
    video_id = sys.argv[1].strip()
    watch = yt.get_watch_playlist(videoId=video_id)
    browse_id = watch.get("lyrics")
    lyrics = yt.get_lyrics(browse_id, timestamps=True) if browse_id else None
    print(json.dumps(lyrics or {}, ensure_ascii=False))
else:
    print(json.dumps(tracks, ensure_ascii=False))
