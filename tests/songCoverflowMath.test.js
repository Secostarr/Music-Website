import { test } from "node:test";
import assert from "node:assert/strict";
import { wrapDelta, cardLayout } from "../src/components/coverflowMath.js";

test("wrapDelta selalu di rentang [-N/2, N/2)", () => {
  for (let N = 3; N <= 12; N++) {
    for (let d = -25; d <= 25; d++) {
      const r = wrapDelta(d, N);
      assert.ok(r >= -N / 2 && r < N / 2, `wrapDelta(${d},${N})=${r}`);
      assert.equal(r, d - Math.round(d / N) * N);
    }
  }
});

test("kartu tengah di (0,0) dan bertatap muka", () => {
  const mid = cardLayout(0, 400);
  assert.equal(mid.x, 0);
  assert.equal(mid.z, 0);
  assert.equal(mid.angle, 0);
});

test("kartu semakin jauh makin ke kanan lalu belakang (z negatif)", () => {
  const c1 = cardLayout(1, 400), c2 = cardLayout(2, 400);
  assert.ok(c1.x > 0 && c2.x > c1.x);
  assert.ok(c1.z < 0 && c2.z < c1.z);
  const left = cardLayout(-1, 400);
  assert.ok(left.x < 0 && left.z < 0);
  assert.ok(Math.abs(left.x + c1.x) < 1e-9); // simetris
});