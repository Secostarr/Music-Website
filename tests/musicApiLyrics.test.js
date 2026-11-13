import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const searchFunction = await readFile(new URL("../api/music/search.py", import.meta.url), "utf8");
const localSearch = await readFile(new URL("../backend/scripts/ytmusic_search.py", import.meta.url), "utf8");

test("LRCLIB fallback is wired to both deployed and local music search APIs", () => {
  for (const source of [searchFunction, localSearch]) {
    assert.ok(source.includes("https://lrclib.net/api/get"));
    assert.ok(source.includes("def lyrics_from_lrclib"));
    assert.ok(source.includes("syncedLyrics"));
    assert.ok(source.includes("plainLyrics"));
  }
});

test("API upgrades low-resolution YouTube thumbnail URL variants", () => {
  assert.ok(searchFunction.includes('replace("w60-h60", "w1200-h1200")'));
  assert.ok(localSearch.includes('replace("w60-h60", "w1200-h1200")'));
});
