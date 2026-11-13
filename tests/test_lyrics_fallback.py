import unittest
from unittest.mock import patch
import sys
from pathlib import Path

# Add backend/scripts to sys.path
sys.path.insert(0, str(Path(__file__).parents[1] / "backend" / "scripts"))
import ytmusic_search


class LyricsFallbackTest(unittest.TestCase):
    @patch("ytmusic_search.urllib.request.urlopen")
    def test_lrclib_synced_lyrics_are_converted_to_timed_lines(self, open_url):
        class Response:
            def __enter__(self):
                return self

            def __exit__(self, *_):
                return None

            def read(self):
                return b'{"syncedLyrics":"[00:01.20]First line\\n[00:03.50]Second line","plainLyrics":"First line\\nSecond line"}'

        open_url.return_value = Response()
        result = ytmusic_search.lyrics_from_lrclib("Song", "Artist")
        self.assertIn("track_name=Song", open_url.call_args.args[0].full_url)
        self.assertIn("artist_name=Artist", open_url.call_args.args[0].full_url)
        self.assertEqual(result["lyrics"][0]["start_time"], 1200)
        self.assertEqual(result["lyrics"][1]["text"], "Second line")

    @patch("ytmusic_search.urllib.request.urlopen")
    def test_lrclib_plain_lyrics_fallback(self, open_url):
        class Response:
            def __enter__(self):
                return self

            def __exit__(self, *_):
                return None

            def read(self):
                return b'{"plainLyrics":"Plain lyric"}'

        open_url.return_value = Response()
        self.assertEqual(ytmusic_search.lyrics_from_lrclib("Song", "Artist")["lyrics"], "Plain lyric")


if __name__ == "__main__":
    unittest.main()
