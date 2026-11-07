import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  ExternalLink,
} from "lucide-react";
import { formatDuration } from "../services/musicApi";

export default function Player({
  currentTrack,
  isPlaying,
  setIsPlaying,
  onNext,
  onPrev,
  isShuffle,
  setIsShuffle,
}) {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // 'off', 'all', 'one'
  const [isLoading, setIsLoading] = useState(false);

  // Sync stream URL when currentTrack changes
  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;
    if (currentTrack.previewUrl) {
      audioRef.current.src = currentTrack.previewUrl;
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsLoading(true);

      if (isPlaying) {
        audioRef.current
          .play()
          .then(() => setIsLoading(false))
          .catch((err) => {
            console.warn("Autoplay dicegah browser:", err);
            setIsLoading(false);
          });
      }
    }
  }, [currentTrack]);

  // Sync play/pause state
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 30);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const handleEnded = () => {
    if (repeatMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      onNext();
    }
  };

  const toggleRepeat = () => {
    if (repeatMode === "off") setRepeatMode("all");
    else if (repeatMode === "all") setRepeatMode("one");
    else setRepeatMode("off");
  };

  if (!currentTrack) return null;

  const artwork =
    currentTrack.artwork ||
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-xl border-t border-gray-800/80 px-4 sm:px-6 py-3 shadow-2xl">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEnded}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
      />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Track Info (Left) */}
        <div className="flex items-center gap-3.5 w-full md:w-1/4 min-w-[200px]">
          <img
            src={artwork}
            alt={currentTrack.title}
            className="w-12 h-12 rounded-lg object-cover shadow-md border border-gray-800"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-white truncate" title={currentTrack.title}>
              {currentTrack.title}
            </h4>
            <p className="text-xs text-gray-400 truncate mt-0.5" title={currentTrack.artist}>
              {currentTrack.artist}
            </p>
          </div>
          {currentTrack.link && (
            <a
              href={currentTrack.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-purple-400 p-1 transition-colors"
              title="Dengarkan full di Deezer"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Center Controls & Scrubber */}
        <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`p-1.5 rounded-full transition-colors ${
                isShuffle ? "text-purple-400" : "text-gray-400 hover:text-white"
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={onPrev}
              className="text-gray-300 hover:text-white transition-colors"
              title="Previous"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 transition-transform active:scale-95"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white translate-x-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              className="text-gray-300 hover:text-white transition-colors"
              title="Next"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-1.5 rounded-full transition-colors ${
                repeatMode !== "off" ? "text-purple-400" : "text-gray-400 hover:text-white"
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === "one" ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Time scrubber */}
          <div className="w-full flex items-center gap-3 text-xs text-gray-400 font-mono">
            <span className="w-9 text-right">{formatDuration(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 30}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:h-1.5 transition-all"
            />
            <span className="w-9">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Volume & Extras (Right) */}
        <div className="hidden md:flex items-center justify-end gap-2.5 w-1/4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5 text-red-400" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-24 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>
    </div>
  );
}
