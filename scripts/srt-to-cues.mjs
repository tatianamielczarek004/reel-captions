#!/usr/bin/env node
// Convert an SRT subtitle file into reel-captions cues (JSON on stdout).
// Usage: node scripts/srt-to-cues.mjs subtitles.srt [fps=25]
//
// Each SRT block becomes one cue: its first line goes to `top`, the rest to `big`.
// If a block has a single line, that line becomes `big`.
import {readFileSync} from 'node:fs';

const [file, fpsArg] = process.argv.slice(2);
if (!file) {
  console.error('Usage: node scripts/srt-to-cues.mjs <file.srt> [fps=25]');
  process.exit(1);
}
const fps = Number(fpsArg ?? 25);
if (!Number.isFinite(fps) || fps <= 0) {
  console.error('fps must be a positive number');
  process.exit(1);
}

const toFrames = (h, m, s, ms) => Math.round(((+h * 60 + +m) * 60 + +s + +ms / 1000) * fps);

const blocks = readFileSync(file, 'utf8').replace(/\r/g, '').trim().split(/\n{2,}/);
const cues = [];

for (const block of blocks) {
  const lines = block.split('\n');
  const timeIdx = lines.findIndex((l) => l.includes('-->'));
  if (timeIdx < 0) continue;
  const m = lines[timeIdx].match(/(\d+):(\d+):(\d+)[,.](\d+)\s*-->/);
  if (!m) continue;
  const text = lines.slice(timeIdx + 1).map((l) => l.trim()).filter(Boolean);
  if (text.length === 0) continue;
  const from = toFrames(m[1], m[2], m[3], m[4]);
  cues.push(text.length === 1 ? {from, top: '', big: text[0]} : {from, top: text[0], big: text.slice(1).join(' ')});
}

console.log(JSON.stringify(cues, null, 2));
