import json
import os
import sys

import whisper

model = whisper.load_model("small")
result = model.transcribe(sys.argv[1], word_timestamps=True, verbose=False)
segments = []
for segment in result["segments"]:
    words = segment.get("words") or []
    if words:
        for word in words:
            text = word["word"].strip()
            if text:
                segments.append({"time": round(word["start"], 2), "text": text})
    elif segment["text"].strip():
        segments.append({"time": round(segment["start"], 2), "text": segment["text"].strip()})
print(json.dumps({"language": result.get("language"), "segments": segments}, ensure_ascii=False))
