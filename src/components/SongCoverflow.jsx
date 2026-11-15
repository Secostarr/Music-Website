import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import { wrapDelta, cardLayout } from "./coverflowMath";
const FALLBACK_ART =
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60";

export default function SongCoverflow({ tracks, onPlay, currentId, isPlaying }) {
  const scRef = useRef(null);
  const cardRefs = useRef([]);
  const st = useRef({ pos: 0, target: 0, drag: false, sx: 0, sp: 0, moved: 0, justDragged: false });
  const wheelTimer = useRef(0);
  const [centerIdx, setCenterIdx] = useState(0);
  const N = tracks.length;

  // 3D coverflow layout loop (mirrors reference site: rotateY ring around centre card)
  useEffect(() => {
    if (!N) return undefined;
    let raf;
    let lastIdx = -1;
    let lastPos = NaN;
    const loop = () => {
      const s = st.current;
      if (!s.drag) {
        const diff = s.target - s.pos;
        s.pos += Math.abs(diff) < 0.001 ? diff : diff * 0.12;
      }
      const el = scRef.current;
      // Hemat CPU: lewati penulisan style saat posisi sudah konvergen dan tidak berubah
      if (el && s.pos !== lastPos) {
        lastPos = s.pos;
        const w = cardRefs.current[0]?.offsetWidth || 300;
        cardRefs.current.forEach((c, i) => {
          if (!c) return;
          const d = wrapDelta(i - s.pos, N);
          const ad = Math.abs(d);
          const { x, z, angle } = cardLayout(d, w);
          c.style.transform = `translate3d(${x}px,0,${z}px) rotateY(${angle}rad)`;
          c.style.opacity = ad > 3.4 ? "0" : ad > 2.6 ? (3.4 - ad) / 0.8 : "1";
          c.style.zIndex = 100 - Math.round(ad * 10);
          c.style.pointerEvents = ad > 3 ? "none" : "";
          c.classList.toggle("is-center", ad < 0.5);
          c.tabIndex = ad < 0.5 ? 0 : -1;
        });
      }
      const ci = ((Math.round(s.target) % N) + N) % N;
      if (ci !== lastIdx) { lastIdx = ci; setCenterIdx(ci); }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [N]);

  // horizontal trackpad wheel needs a non-passive native listener
  useEffect(() => {
    const el = scRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 4) {
        e.preventDefault();
        st.current.target += e.deltaX / 400;
        clearTimeout(wheelTimer.current);
        wheelTimer.current = setTimeout(() => { st.current.target = Math.round(st.current.target); }, 140);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [N]);

  const go = useCallback((i) => {
    const s = st.current;
    s.target = Math.round(s.target) + Math.round(wrapDelta(i - ((Math.round(s.target) % N) + N) % N, N));
  }, [N]);

  const onPointerDown = (e) => {
    const s = st.current;
    s.drag = true; s.moved = 0; s.justDragged = false; s.sx = e.clientX; s.sp = s.pos;
    scRef.current.classList.add("dragging");
    scRef.current.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    const s = st.current;
    if (!s.drag) return;
    const dx = e.clientX - s.sx;
    s.moved = Math.max(s.moved, Math.abs(dx));
    s.pos = s.sp - dx / ((cardRefs.current[0]?.offsetWidth || 300) * 1.1);
  };
  const endDrag = (e) => {
    const s = st.current;
    if (!s.drag) return;
    s.drag = false;
    scRef.current.classList.remove("dragging");
    if (s.moved >= 6) { s.justDragged = true; s.target = Math.round(s.pos); return; }
    // tap, not drag
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest(".sc-card");
    const i = cardRefs.current.indexOf(el);
    if (i >= 0) {
      if (el.classList.contains("is-center")) onPlay(tracks[i]);
      else go(i);
    }
    s.target = Math.round(s.target);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPlay(tracks[centerIdx]); }
    if (e.key === "ArrowLeft") go(centerIdx - 1);
    if (e.key === "ArrowRight") go(centerIdx + 1);
  };

  if (!N) return null;
  const centered = tracks[centerIdx];

  return (
    <div>
      <div
        ref={scRef}
        className="sc"
        role="listbox"
        aria-label="Lagu populer — geser atau gunakan tombol panah"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        tabIndex={0}
      >
        {tracks.map((t, i) => {
          const art = t.artwork || FALLBACK_ART;
          const isCurrent = t.id === currentId;
          return (
            <button
              type="button"
              key={t.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="sc-card"
              style={{ opacity: i === 0 ? 1 : 0 }}
              aria-label={`${i + 1}. ${t.title} — ${t.artist}. Putar`}
            >
              <img className="sc-fb" src={art} alt="" aria-hidden="true" loading="lazy" />
              <div className="sc-shade" />
              <span className="sc-n">{String(i + 1).padStart(2, "0")}{t.album ? ` · ${t.album}` : ""}</span>
              <span className="sc-title">{t.title}</span>
              <span className="sc-artist">{t.artist}</span>
              <span className="sc-go">
                {isCurrent && isPlaying ? (
                  <><Pause className="w-3 h-3 fill-current" /> Jeda</>
                ) : (
                  <><Play className="w-3 h-3 fill-current translate-x-px" /> Putar</>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="sc-ui">
        <button type="button" className="sc-arrow" onClick={() => go(centerIdx - 1)} aria-label="Lagu sebelumnya">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10 3 5 8l5 5" /></svg>
        </button>
        <span className="sc-count" aria-live="polite">
          <b>{String(centerIdx + 1).padStart(2, "0")}</b> / {String(N).padStart(2, "0")}
          {centered && <em className="sc-now"> — {centered.title}</em>}
        </span>
        <button type="button" className="sc-arrow" onClick={() => go(centerIdx + 1)} aria-label="Lagu berikutnya">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m6 3 5 5-5 5" /></svg>
        </button>
      </div>
    </div>
  );
}