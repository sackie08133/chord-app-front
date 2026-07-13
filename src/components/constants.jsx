export const StringsStandard = [
    { index: 0, name: 'E', chromScaleNum: 4, octave: 2}, 
    { index: 1, name: 'A', chromScaleNum: 9, octave: 2}, 
    { index: 2, name: 'D', chromScaleNum: 2, octave: 3}, 
    { index: 3, name: 'G', chromScaleNum: 7, octave: 3}, 
    { index: 4, name: 'B', chromScaleNum: 11,octave: 3}, 
    { index: 5, name: 'E', chromScaleNum: 4, octave: 4}
];

export const Notes = [
    ["C"],
    ["C#", "Db"],
    ["D"],
    ["D#","Eb"],
    ["E"],
    ["F"],
    ["F#", "Gb"],
    ["G"], 
    ["G#", "Ab"],
    ["A"],
    ["A#", "Bb"],
    ["B"]
]

// ViewBox dimensions
export const viewBoxWidth = 1000;
export const viewBoxHeight = 400;

// Fretboard layout constants
export const fretboardTopY = 40;
export const fretboardBottomY = 250;
export const stringStartY = 70;
export const stringSpacing = 30;

// Fret calculations
export const startX = 100;
export const endX = 1000;
export const numFrets = 16;
export const ratio = Math.pow(0.5, 1/numFrets);
export const totalDistance = endX - startX;
export const firstGap = totalDistance * (1 - ratio) / (1 - Math.pow(ratio, numFrets));

export const fretPos = Array.from({length: 16}).map((_, i) => {
  let x = startX;
  for (let j = 0; j < i; j++) {
    x += firstGap * Math.pow(ratio, j);
  }
  return x;
});

export const fretboardMarkerPos = [2, 4,6,8,11,14].map(fretNum => fretPos[fretNum]);

// Marker positioning
export const markerY = 100;

// Open string position
export const openStringX = startX - 20;

export const scales = {
  major: { pattern: [2, 2, 1, 2, 2, 2, 1]},
  naturalMinor: { pattern: [2, 1, 2, 2, 1, 2, 2] },
  harmonicMinor: { pattern: [2, 1, 2, 2, 1, 3, 1] },
  melodicMinor: { pattern: [2, 1, 2, 2, 2, 2, 1] },
  pentatonicMajor: { pattern: [2, 2, 3, 2, 3] },
  pentatonicMinor: { pattern: [3, 2, 2, 3, 2] },
  blues: { pattern: [3, 2, 1, 1, 3, 2] },
  dorian: { pattern: [2, 1, 2, 2, 2, 1, 2] },
  phrygian: { pattern: [1, 2, 2, 2, 1, 2, 2] },
  lydian: { pattern: [2, 2, 2, 1, 2, 2, 1] },
  mixolydian: { pattern: [2, 2, 1, 2, 2, 1, 2] },
  locrian: { pattern: [1, 2, 2, 1, 2, 2, 2] }
}

export const API_URL = 'http://localhost:3001'
