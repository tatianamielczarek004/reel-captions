# reel-captions

Animated, word-by-word captions for vertical video (Instagram Reels, YouTube Shorts, TikTok), built with [Remotion](https://www.remotion.dev/).

Each caption has a small line on top and a big accent line below. Words spring in one after another, with the direction and scale alternating between cues. The output is a transparent video you drop on top of your footage in any editor (DaVinci Resolve, Premiere, Final Cut, CapCut).

I made it because I wanted captions synced to the voice with more control than the built-in text tools give, and because rendering them as a separate transparent clip keeps the edit non-destructive.

## Quick start

```bash
npm install
npm run studio     # preview and tweak in the browser
npm run render     # writes out/captions.mov (ProRes 4444 with alpha)
```

## Your own captions

Cues are a list of `{from, top, big}` where `from` is the start frame:

```ts
const cues = [
  {from: 0,  top: 'LOOKING FOR', big: 'a place'},
  {from: 44, top: 'THAT GIVES YOU MORE', big: 'room to live?'},
];
```

A cue stays on screen until the next one starts. Keep `top` identical across consecutive cues if you want the top line to stay still while only the big line changes.

### From an SRT file

```bash
npm run srt -- subtitles.srt 25 > src/my-cues.json
```

The first line of each subtitle becomes `top`, the rest becomes `big`. A single-line subtitle becomes `big`. Then import the JSON in `src/Root.tsx` instead of `example-cues.ts`.

## Options

Pass these as props (see `defaultCaptionsProps` in `src/Captions.tsx`):

| Prop | Default | What it does |
| --- | --- | --- |
| `fontFamily` | Poppins, Helvetica, Arial | Load the font in your project, for example with `@remotion/google-fonts` |
| `textColor` | `#ffffff` | Top line colour |
| `accentColor` | `#F2D8A0` | Big line colour |
| `topSize` / `bigSize` | 64 / 150 | Maximum font sizes in px. Long lines shrink automatically to fit `maxWidth` |
| `bottomOffset` | 540 | Distance from the bottom edge, in px |
| `maxWidth` | 920 | Width of the caption block, in px |

## Tips

- Match the composition `fps` in `src/Root.tsx` to your footage. If they differ, the cue timing and the speed of the result will be off.
- Keep captions out of the areas covered by the Reels interface (bottom ~20% and the right edge).
- To render with a different codec (for example H.264 without alpha), edit the `render` script in `package.json`.

## License

MIT
