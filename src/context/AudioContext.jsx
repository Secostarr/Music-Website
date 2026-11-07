import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { isValidUnifiedTrack } from "../data/viralSounds";

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  // Single HTMLAudioElement instance reference
  const audioRef = useRef(null);

  // State
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // 'off' | 'all' | 'one'
  const [isLoopSegment, setIsLoopSegment] = useState(false);

  // Ref to hold playback generation to prevent race conditions during rapid switching
  const playGenerationRef = useRef(0);

  // Keep latest state in refs for use inside stable audio event handlers
  const stateRef = useRef({
    currentTrack,
    playlist,
    isShuffle,
    repeatMode,
    isLoopSegment,
    volume,
    isMuted,
    playGen: 0,
  });

  useEffect(() => {
    stateRef.current = {
      currentTrack,
      playlist,
      isShuffle,
      repeatMode,
      isLoopSegment,
      volume,
      isMuted,
      playGen: playGenerationRef.current,
    };
  }, [currentTrack, playlist, isShuffle, repeatMode, isLoopSegment, volume, isMuted]);

  // Handle Play Promise safely
  const safePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
    } catch (err) {
      if (err.name !== "AbortError") {
        console.warn("Audio play prevented or interrupted:", err);
        setIsPlaying(false);
      }
    }
  }, []);

  // Set Volume & Mute logic
  const setVolume = useCallback((val) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = stateRef.current.isMuted ? 0 : clamped;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.volume = next ? 0 : stateRef.current.volume;
      }
      return next;
    });
  }, []);

  // Track playback starter
  const playTrack = useCallback(
    async (track, newPlaylist = null) => {
      if (!track) return;

      const audio = audioRef.current;

      // Perlindungan level engine: Track curated wajib lolos seluruh validator legal sebelum diputar
      if (track.source === "curated" && !isValidUnifiedTrack(track)) {
        console.warn("Playback ditolak: Track curated tidak memenuhi standar verifikasi legal", track);
        // Hentikan pemutaran audio yang sedang berjalan agar tidak terjadi ghost playback
        if (audio) {
          audio.pause();
        }
        setError("Track tidak memenuhi standar verifikasi legal");
        setIsPlaying(false);
        setIsLoading(false);
        return;
      }

      if (!audio) return;

      const currentGen = ++playGenerationRef.current;
      stateRef.current.playGen = currentGen;
      setError(null);

      // Ambil audio URL (dukung UnifiedTrack.audioUrl atau legacy previewUrl)
      const url = track.audioUrl || track.previewUrl;
      if (!url) {
        setError("Sumber audio tidak tersedia");
        setIsPlaying(false);
        setIsLoading(false);
        return;
      }

      if (newPlaylist && Array.isArray(newPlaylist)) {
        setPlaylist(newPlaylist);
      }

      setCurrentTrack(track);
      setIsLoading(true);

      // Periksa apakah audio source berubah
      if (audio.src !== url) {
        audio.src = url;
      }

      // Pastikan volume dan mute konsisten
      audio.volume = stateRef.current.isMuted ? 0 : stateRef.current.volume;

      // Estimasi awal durasi sebelum metadata media terurai:
      // Gunakan previewDuration jika tersedia, lalu duration track jika positif, atau 0
      const initialEstimate =
        typeof track.previewDuration === "number" &&
        Number.isFinite(track.previewDuration) &&
        track.previewDuration > 0
          ? track.previewDuration
          : typeof track.duration === "number" &&
            Number.isFinite(track.duration) &&
            track.duration > 0
          ? track.duration
          : 0;

      // Validasi posisi awal segmen terhadap estimasi (jika diketahui)
      const rawStart = typeof track.segmentStart === "number" && Number.isFinite(track.segmentStart)
        ? track.segmentStart
        : 0;

      const startPos =
        initialEstimate > 0
          ? Math.max(0, Math.min(rawStart, Math.max(0, initialEstimate - 0.1)))
          : Math.max(0, rawStart);

      audio.currentTime = startPos;
      setCurrentTime(startPos);
      setDuration(initialEstimate);

      // Auto-enable segment loop hanya jika track dirancang sebagai segment loopable
      const hasValidSegment =
        typeof track.segmentEnd === "number" &&
        Number.isFinite(track.segmentEnd) &&
        track.segmentEnd > startPos &&
        (track.type === "segment" || track.isLoopable === true);

      setIsLoopSegment(hasValidSegment);

      try {
        await audio.play();
        if (currentGen === playGenerationRef.current) {
          setIsPlaying(true);
          setIsLoading(false);
        }
      } catch (err) {
        if (currentGen === playGenerationRef.current) {
          if (err.name !== "AbortError") {
            setError("Gagal memutar audio");
            setIsPlaying(false);
          }
          setIsLoading(false);
        }
      }
    },
    []
  );

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    setIsLoading(true);
    try {
      await audio.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Gagal melanjutkan pemutaran");
        setIsPlaying(false);
      }
      setIsLoading(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      if (currentTrack) {
        resume();
      }
    }
  }, [isPlaying, currentTrack, pause, resume]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;
    const track = stateRef.current.currentTrack;

    // Batas aktual adalah audio.duration jika sudah terurai dan finite,
    // atau fallback ke previewDuration / duration terdaftar
    const mediaDur =
      audio.duration && Number.isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : null;

    const maxDur =
      mediaDur ??
      (typeof track?.previewDuration === "number" && Number.isFinite(track.previewDuration) && track.previewDuration > 0
        ? track.previewDuration
        : typeof track?.duration === "number" && Number.isFinite(track.duration) && track.duration > 0
        ? track.duration
        : 0);

    const safeTime = Number.isFinite(time) ? Math.max(0, time) : 0;
    const clamped = maxDur > 0 ? Math.min(safeTime, maxDur) : safeTime;

    audio.currentTime = clamped;
    setCurrentTime(clamped);
  }, []);

  const toggleLoopSegment = useCallback(() => {
    const track = stateRef.current.currentTrack;
    if (!track) return;

    const audio = audioRef.current;
    const mediaDur =
      audio && audio.duration && Number.isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : track.previewDuration || track.duration || 0;

    const segStart =
      typeof track.segmentStart === "number" && Number.isFinite(track.segmentStart)
        ? Math.max(0, track.segmentStart)
        : 0;

    const rawEnd =
      typeof track.segmentEnd === "number" && Number.isFinite(track.segmentEnd)
        ? track.segmentEnd
        : mediaDur;

    const segEnd = mediaDur > 0 ? Math.min(rawEnd, mediaDur) : rawEnd;

    // Hanya aktifkan jika segmentEnd lebih besar dari segmentStart
    if (segEnd > segStart) {
      setIsLoopSegment((prev) => !prev);
    }
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  }, []);

  // Next / Prev track
  const nextTrack = useCallback(() => {
    const { playlist: list, currentTrack: track, isShuffle: shuffle } = stateRef.current;
    if (!list || list.length === 0) return;

    if (list.length === 1) {
      if (audioRef.current) {
        const startPos =
          typeof track?.segmentStart === "number" && Number.isFinite(track.segmentStart)
            ? Math.max(0, track.segmentStart)
            : 0;
        audioRef.current.currentTime = startPos;
        safePlay();
      }
      return;
    }

    if (shuffle) {
      const randIdx = Math.floor(Math.random() * list.length);
      playTrack(list[randIdx]);
      return;
    }

    const currIdx = list.findIndex((t) => t.id === track?.id);
    const nextIdx = currIdx === -1 ? 0 : (currIdx + 1) % list.length;
    playTrack(list[nextIdx]);
  }, [playTrack, safePlay]);

  const prevTrack = useCallback(() => {
    const { playlist: list, currentTrack: track } = stateRef.current;
    if (!list || list.length === 0) return;

    if (list.length === 1) {
      if (audioRef.current) {
        const startPos =
          typeof track?.segmentStart === "number" && Number.isFinite(track.segmentStart)
            ? Math.max(0, track.segmentStart)
            : 0;
        audioRef.current.currentTime = startPos;
        safePlay();
      }
      return;
    }

    const currIdx = list.findIndex((t) => t.id === track?.id);
    const prevIdx = currIdx === -1 ? 0 : (currIdx - 1 + list.length) % list.length;
    playTrack(list[prevIdx]);
  }, [playTrack, safePlay]);

  // Inisialisasi dan pasang event listener tunggal pada audio element saat mount
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const isCurrentRequest = () => stateRef.current.playGen === playGenerationRef.current;

    const handlePlay = () => {
      if (isCurrentRequest()) setIsPlaying(true);
    };

    const handlePause = () => {
      if (isCurrentRequest()) setIsPlaying(false);
    };

    const handleWaiting = () => {
      if (isCurrentRequest()) setIsLoading(true);
    };

    const handleCanPlay = () => {
      if (isCurrentRequest()) setIsLoading(false);
    };

    const handleLoadedMetadata = () => {
      if (!isCurrentRequest()) return;

      const track = stateRef.current.currentTrack;
      // Gunakan media duration aktual dari audio element jika valid dan finite
      const mediaDur =
        audio.duration && Number.isFinite(audio.duration) && audio.duration > 0
          ? audio.duration
          : null;

      // Jika mediaDur tersedia, gunakan mediaDur. Jika belum, gunakan previewDuration / track duration
      const resolvedDur =
        mediaDur ??
        (typeof track?.previewDuration === "number" && Number.isFinite(track.previewDuration) && track.previewDuration > 0
          ? track.previewDuration
          : typeof track?.duration === "number" && Number.isFinite(track.duration) && track.duration > 0
          ? track.duration
          : 0);

      setDuration(resolvedDur);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      if (!isCurrentRequest()) return;

      const track = stateRef.current.currentTrack;
      const isLoop = stateRef.current.isLoopSegment;
      const curTime = audio.currentTime;
      setCurrentTime(curTime);

      // Cek segment looping
      if (isLoop && track) {
        const mediaDur =
          audio.duration && Number.isFinite(audio.duration) && audio.duration > 0
            ? audio.duration
            : track.previewDuration || track.duration || 0;

        const segStart =
          typeof track.segmentStart === "number" && Number.isFinite(track.segmentStart)
            ? Math.max(0, track.segmentStart)
            : 0;

        const rawEnd =
          typeof track.segmentEnd === "number" && Number.isFinite(track.segmentEnd) && track.segmentEnd > segStart
            ? track.segmentEnd
            : mediaDur;

        // segmentEnd tidak boleh melebihi mediaDur aktual jika mediaDur diketahui
        const segEnd = mediaDur > 0 ? Math.min(rawEnd, mediaDur) : rawEnd;

        if (segEnd > segStart && curTime >= segEnd) {
          audio.currentTime = segStart;
          safePlay();
        }
      }
    };

    const handleEnded = () => {
      if (!isCurrentRequest()) return;

      const { repeatMode: repeat, isLoopSegment: isLoop, currentTrack: track } = stateRef.current;

      // Prioritas 1: Segment Loop
      if (isLoop && track) {
        const segStart =
          typeof track.segmentStart === "number" && Number.isFinite(track.segmentStart)
            ? Math.max(0, track.segmentStart)
            : 0;
        audio.currentTime = segStart;
        safePlay();
        return;
      }

      // Prioritas 2: Repeat One
      if (repeat === "one") {
        const startPos =
          typeof track?.segmentStart === "number" && Number.isFinite(track.segmentStart)
            ? Math.max(0, track.segmentStart)
            : 0;
        audio.currentTime = startPos;
        safePlay();
        return;
      }

      // Prioritas 3: Repeat All
      if (repeat === "all") {
        nextTrack();
        return;
      }

      // Default: Repeat Off
      const { playlist: list } = stateRef.current;
      const currIdx = list.findIndex((t) => t.id === track?.id);
      if (currIdx !== -1 && currIdx < list.length - 1) {
        nextTrack();
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = () => {
      if (!isCurrentRequest()) return;
      console.warn("Audio element error event:", audio.error);
      setIsLoading(false);
      setIsPlaying(false);
      setError("Gagal memuat format audio");
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [nextTrack, safePlay]);

  const value = useMemo(
    () => ({
      currentTrack,
      playlist,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      isLoading,
      error,
      isShuffle,
      repeatMode,
      isLoopSegment,
      playTrack,
      togglePlay,
      pause,
      resume,
      seek,
      setVolume,
      toggleMute,
      toggleLoopSegment,
      nextTrack,
      prevTrack,
      toggleShuffle,
      toggleRepeat,
      setPlaylist,
    }),
    [
      currentTrack,
      playlist,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      isLoading,
      error,
      isShuffle,
      repeatMode,
      isLoopSegment,
      playTrack,
      togglePlay,
      pause,
      resume,
      seek,
      setVolume,
      toggleMute,
      toggleLoopSegment,
      nextTrack,
      prevTrack,
      toggleShuffle,
      toggleRepeat,
      setPlaylist,
    ]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio harus digunakan di dalam AudioProvider");
  }
  return context;
}
