import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * One caption "cue". `from` is the frame where it appears; it stays until the
 * next cue starts. Each cue has a small line on top and an optional big accent
 * line below. Keep `top` identical across consecutive cues to avoid re-animating it.
 */
export type Cue = {from: number; top?: string; big?: string};

export type CaptionsProps = {
  cues: Cue[];
  fontFamily: string;
  textColor: string;
  accentColor: string;
  topSize: number;
  bigSize: number;
  /** Distance from the bottom edge of the frame to the caption block, in px. */
  bottomOffset: number;
  /** Max width of the caption block, in px. */
  maxWidth: number;
};

export const defaultCaptionsProps: CaptionsProps = {
  cues: [],
  fontFamily: 'Poppins, Helvetica, Arial, sans-serif',
  textColor: '#ffffff',
  accentColor: '#F2D8A0',
  topSize: 64,
  bigSize: 150,
  bottomOffset: 540,
  maxWidth: 920,
};

type LineProps = {
  text?: string;
  start: number;
  size: number;
  maxWidth: number;
  weight: number;
  color: string;
  fontFamily: string;
  accent?: boolean;
  variant: number;
};

const Line: React.FC<LineProps> = ({text, start, size: maxSize, maxWidth, weight, color, fontFamily, accent, variant}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (!text) return null;

  // Shrink long lines so they always fit in `maxWidth`
  // (rough estimate: ~0.6em per character including spacing).
  const size = Math.min(maxSize, maxWidth / (text.length * 0.6));
  const t = frame - start;
  const words = text.split(' ');

  return (
    <div style={{display: 'flex', gap: size * 0.28, justifyContent: 'center', whiteSpace: 'nowrap'}}>
      {words.map((word, i) => {
        // Words enter one after another, 3 frames apart.
        const p = spring({frame: t - i * 3, fps, config: {damping: 14, stiffness: 140}});
        // Alternate direction (up/down) and scale between cues so it never feels repetitive.
        const y = interpolate(p, [0, 1], variant % 2 ? [60, 0] : [-60, 0]);
        const blur = interpolate(p, [0, 1], [12, 0]);
        const scale = interpolate(p, [0, 1], variant % 3 === 2 ? [1.5, 1] : [0.9, 1]);
        return (
          <span
            key={i}
            style={{
              fontFamily,
              fontWeight: weight,
              fontSize: size,
              letterSpacing: accent ? 0 : size * 0.06,
              color,
              opacity: Math.min(1, p * 1.4),
              transform: `translateY(${y}px) scale(${scale})`,
              filter: `blur(${blur}px)`,
              textShadow: '0 4px 10px rgba(0,0,0,.85)',
              display: 'inline-block',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export const Captions: React.FC<CaptionsProps> = ({
  cues,
  fontFamily,
  textColor,
  accentColor,
  topSize,
  bigSize,
  bottomOffset,
  maxWidth,
}) => {
  const frame = useCurrentFrame();
  if (cues.length === 0) return null;

  // Active cue = last one whose start frame has been reached.
  let idx = -1;
  cues.forEach((c, i) => {
    if (frame >= c.from) idx = i;
  });
  if (idx < 0) return null;

  const cue = cues[idx];

  // The top line only re-animates when its text changes, so walk back
  // through the run of cues that share the same `top`.
  let runStart = idx;
  while (runStart > 0 && cues[runStart - 1].top === cue.top) runStart--;
  const topFrom = cues[runStart].from;

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: bottomOffset}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: maxWidth}}>
        <Line text={cue.top} start={topFrom} size={topSize} maxWidth={maxWidth} weight={600} color={textColor} fontFamily={fontFamily} variant={idx} />
        <Line text={cue.big} start={cue.from} size={bigSize} maxWidth={maxWidth} weight={800} color={accentColor} fontFamily={fontFamily} accent variant={idx + 1} />
      </div>
    </AbsoluteFill>
  );
};
