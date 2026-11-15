// Perhitungan offset kartu karosel 3D (wrap infinite tanpa loncatan)
export const STEP = (23 * Math.PI) / 180;

export function wrapDelta(d, N) {
  return ((d % N) + N + N / 2) % N - N / 2;
}

export function cardLayout(d, cardWidth) {
  const R = (cardWidth * 1.12) / Math.sin(STEP);
  const a = d * STEP;
  return {
    x: R * Math.sin(a),
    z: R * (Math.cos(a) - 1) - Math.abs(d) * 30,
    angle: a,
  };
}