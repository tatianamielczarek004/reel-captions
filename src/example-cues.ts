import type {Cue} from './Captions';

// Example cues at 25 fps. Replace with your own, or generate them from an SRT:
//   npm run srt -- subtitles.srt 25 > src/my-cues.json
export const exampleCues: Cue[] = [
  {from: 0, top: 'LOOKING FOR', big: 'a place'},
  {from: 25, top: 'THAT GIVES YOU MORE', big: ''},
  {from: 44, top: 'THAT GIVES YOU MORE', big: 'room to live?'},
  {from: 90, top: 'THEN STAY WITH ME', big: 'for a moment,'},
  {from: 130, top: 'BECAUSE THIS ONE', big: 'might be it.'},
  {from: 175, top: 'SOUNDS GOOD?', big: 'Write to me.'},
];
