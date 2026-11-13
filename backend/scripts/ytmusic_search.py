import json
import os
import socket
import sys
import re
import urllib.parse
import urllib.request

# Force utf-8 stdout so Windows default codepage (cp1252) does not crash on unicode characters in song titles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from ytmusicapi import YTMusic

# ponytail: Windows PHP child processes can inherit a broken DNS resolver; use a fresh OS lookup for YT Music only.
if sys.platform == "win32":
    addresses = socket.getaddrinfo
    socket.getaddrinfo = lambda host, port, *args, **kwargs: addresses(os.environ.get("YTMUSIC_RESOLVED_IP"), port, *args, **kwargs) if host == "music.youtube.com" and os.environ.get("YTMUSIC_RESOLVED_IP") else addresses(host, port, *args, **kwargs)

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
    if plain.strip():
        return {"lyrics": plain.strip(), "source": "lrclib"}
    return {}


def get_lyrics(video_id):
    title, artist = "", ""
    try:
        watch = yt.get_watch_playlist(videoId=video_id)
        title = watch.get("title", "")
        artist = ", ".join(item.get("name", "") for item in watch.get("artists", []) if item.get("name"))
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
            artists = song.get("artists") or []
            artist = ", ".join(item.get("name", "") for item in artists if item.get("name")) or artist
    except Exception:
        pass

    return lyrics_from_lrclib(title, artist) if title and artist else {}


yt = YTMusic()
query = sys.argv[1].strip() if len(sys.argv) > 1 else ""

if len(sys.argv) > 2 and sys.argv[2] == "lyrics":
    video_id = sys.argv[1].strip()
    try:
        result = get_lyrics(video_id)
        # LyricLine objects from ytmusicapi are dataclasses, not dicts — serialize manually.
        lyrics = result.get("lyrics") if isinstance(result, dict) else None
        if isinstance(lyrics, list) and lyrics and hasattr(lyrics[0], "text"):
            result = {
                **{k: v for k, v in result.items() if k != "lyrics"},
                "lyrics": [
                    {"id": i, "start_time": ll.start_time, "end_time": ll.end_time, "text": ll.text, "lyricLine": ll.text}
                    for i, ll in enumerate(lyrics)
                ],
            }
        print(json.dumps(result, ensure_ascii=False))
    except Exception as e:
        sys.stderr.write(repr(e) + "\n")
        print(json.dumps({}, ensure_ascii=False))
    sys.exit(0)

if __name__ == "__main__":
    items = yt.search(query or "top songs", filter="songs", limit=30)
    tracks = []
    for item in items:
        video_id = item.get("videoId")
        if not video_id:
            continue
        artists = item.get("artists") or []
        album = item.get("album") or {}
        thumbnails = item.get("thumbnails") or []
        artwork = thumbnails[-1].get("url", "") if thumbnails else ""
        if artwork:
            artwork = artwork.replace("w60-h60", "w1200-h1200").replace("w120-h120", "w1200-h1200")
        tracks.append({
            "id": video_id,
            "source": "youtube",
            "videoId": video_id,
            "title": item.get("title") or "Unknown title",
            "artist": ", ".join(artist.get("name", "") for artist in artists if artist.get("name")) or "Unknown artist",
            "album": album.get("name", ""),
            "artwork": artwork,
            "duration": item.get("duration_seconds") or 0,
            "lyricsBrowseId": item.get("lyrics", {}).get("browseId", "") if isinstance(item.get("lyrics"), dict) else "",
            "audioUrl": "",
            "previewUrl": "",
            "link": "https://music.youtube.com/watch?v=" + video_id,
        })
    print(json.dumps(tracks, ensure_ascii=False))
