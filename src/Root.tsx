import React from 'react';
import {Composition} from 'remotion';
import {Captions, defaultCaptionsProps} from './Captions';
import {exampleCues} from './example-cues';

export const FPS = 25;

export const Root: React.FC = () => (
  <Composition
    id="Captions"
    component={Captions}
    durationInFrames={225}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={{...defaultCaptionsProps, cues: exampleCues}}
  />
);
