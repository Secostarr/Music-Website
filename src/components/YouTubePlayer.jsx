import React, { useEffect, useRef } from "react";
import { useAudio } from "../context/AudioContext";

export default function YouTubePlayer() {
  const hostRef = useRef(null);
  const { currentTrack, volume, setCurrentTime, setDuration, setIsPlaying, setIsLoading, ytPlayerRef, youtubeSeekRef, nextTrack } = useAudio();

  useEffect(() => {
    const track = currentTrack;
    if (!track || track.source !== "youtube") return undefined;
    let cancelled = false;
    let apiWait;
    let progress;
    const videoId = track.videoId;
    youtubeSeekRef.current = (time) => {
      const player = ytPlayerRef.current;
      if (!player?.seekTo || player.getPlayerState?.() === -1) return;
      const duration = player.getDuration?.() || 0;
      const target = Math.max(0, Math.min(Number(time) || 0, duration || Number(time) || 0));
      player.seekTo(target, true);
      setCurrentTime(target);
    };

    const attach = () => {
      if (cancelled || !window.YT?.Player || !hostRef.current) return false;
      const playback = (() => {
        try {
          return JSON.parse(localStorage.getItem("irama_playback") || "null");
        } catch {
          return null;
        }
      })();
      const savedTime = playback?.track?.videoId === videoId ? playback.currentTime || 0 : 0;

      if (ytPlayerRef.current?.loadVideoById) {
        try {
          ytPlayerRef.current.loadVideoById({
            videoId,
            startSeconds: savedTime > 0 ? savedTime : 0,
          });
        } catch (e) {
          console.warn("YouTube loadVideoById error", e);
        }
      } else {
        ytPlayerRef.current = new window.YT.Player(hostRef.current, {
          width: "360",
          height: "220",
          videoId,
          playerVars: {
            playsinline: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            origin: window.location.origin,
            start: Math.floor(savedTime),
          },
          events: {
            onReady: ({ target }) => {
              ytPlayerRef.current = target;
              target.setVolume(Math.round(volume * 100));
              if (savedTime > 0) {
                target.seekTo(savedTime, true);
              }
              target.pauseVideo();
              setIsLoading(false);
              setIsPlaying(false);
            },
            onAutoplayBlocked: () => {
              setIsPlaying(false);
              setIsLoading(false);
            },
            onStateChange: ({ data, target }) => {
              setIsPlaying(data === window.YT.PlayerState.PLAYING);
              setIsLoading(data === window.YT.PlayerState.BUFFERING);
              const actualDuration = target.getDuration();
              if (Number.isFinite(actualDuration) && actualDuration > 0) setDuration(actualDuration);
              if (data === window.YT.PlayerState.ENDED) nextTrack();
            },
            onError: () => {
              setIsLoading(false);
              setIsPlaying(false);
            },
          },
        });
      }
      return true;
    };

    if (!attach()) apiWait = window.setInterval(() => {
      if (attach()) window.clearInterval(apiWait);
    }, 250);
    progress = window.setInterval(() => {
      const player = ytPlayerRef.current;
      if (!player?.getCurrentTime) return;
      const state = player.getPlayerState?.();
      setIsPlaying(state === window.YT?.PlayerState?.PLAYING);
      setIsLoading(state === window.YT?.PlayerState?.BUFFERING);
      const time = player.getCurrentTime();
      if (Number.isFinite(time)) setCurrentTime(time);
      const actualDuration = player.getDuration?.();
      if (Number.isFinite(actualDuration) && actualDuration > 0) setDuration(actualDuration);
    }, 250);
    return () => {
      cancelled = true;
      youtubeSeekRef.current = null;
      window.clearInterval(apiWait);
      window.clearInterval(progress);
    };
  }, [currentTrack?.videoId, currentTrack?.source, nextTrack, setCurrentTime, setDuration, setIsLoading, setIsPlaying, ytPlayerRef, youtubeSeekRef]);

  useEffect(() => {
    if (ytPlayerRef.current?.setVolume) {
      ytPlayerRef.current.setVolume(Math.round(volume * 100));
    }
  }, [volume, ytPlayerRef]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: "-10000px",
        width: "200px",
        height: "200px",
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <div ref={hostRef} id="yt-player-host" style={{ width: "200px", height: "200px" }} />
    </div>
  );
}
