import * as Tone from "tone";
import { playNoteAtTime, playChordAtTime } from "./ChordPlayer";
import { drumTypeNames, drumSynthTypes, noteNamesSharps, instrumentRanges } from "./Constants";
import { chordShapes } from "./ChordShapes";
import { shiftVoicing } from "./Utils";

const stepsDrums = 32;
const stepsGuitar = 32;

export const strummingSteps = 8;

export const rootFretMap = {
  C: 8,
  "C#/Db": 9,
  D: 10,
  "D#/Eb": 11,
  E: 0,
  F: 1,
  "F#/Gb": 2,
  G: 3,
  "G#/Ab": 4,
  A: 5,
  "A#/Bb": 6,
  B: 7,
};

export const chordTypeToFamily = {
  maj: "major",
  min: "minor",
  maj7: "seventh",
  7: "seventh",
  m7: "seventh",
  mMaj7: "seventh",
  6: "sixth",
  m6: "sixth",
  sus2: "suspended",
  sus4: "suspended",
  11: "extended",
  m11: "extended",
};

export function findShape(chordType, shapeId) {
  const familyName = chordTypeToFamily[chordType];
  if (!familyName || !chordShapes[familyName]) return null;
  const chord = chordShapes[familyName].find((item) => item.name === chordType);
  if (!chord) return null;
  return chord.shapes.find((shape) => shape.id === shapeId) || null;
}

export function buildBeats(chordSlots, strumPattern) {
  const beats = [];

  for (const slot of chordSlots) {
    const shape = findShape(slot.chordType, slot.shapeId);
    const rootFret = rootFretMap[slot.root] ?? 0;
    const voicing = shiftVoicing(shape.voicing, rootFret);

    for (let step = 0; step < strummingSteps; step++) {
      const strumType = strumPattern[step] || "rest";
      beats.push({ voicing, strumType });
    }
  }
  return beats;
}

export function playDrumTrack(hits, bpm, offset = 0, loop = false) {
  const hitsSequence = {};
  for (const hit of hits) {
    const drum = drumTypeNames.indexOf(hit.drum_type);
    const col = hit.col;
    const key = `${drum}-${col}`;
    hitsSequence[key] = true;
  }

  const values = Array.from({ length: stepsDrums }).map((_, colIndex) => colIndex);

  function callbackStep(time, col) {
    for (let row = 0; row < drumTypeNames.length; row++) {
      const key = `${row}-${col}`;
      if (hitsSequence[key]) {
        playNoteAtTime(null, null, drumSynthTypes[row], time);
      }
    }
  }

  Tone.Transport.bpm.value = bpm;

  const seq = new Tone.Sequence(callbackStep, values, "16n");
  seq.loop = loop;
  seq.start(offset);
  Tone.Transport.start();

  return seq;
}

export function playGuitarTrack(notes, bpm, offset = 0, loop = false, instrument = "guitar") {
  const notesSequence = {};
  for (const note of notes) {
    const row = noteNamesSharps.indexOf(note.row);
    const col = note.col;
    const octave = note.octave;
    const key = `${row}-${col}-${octave}`;
    notesSequence[key] = true;
  }

  const { min, max } = instrumentRanges[instrument];

  const values = Array.from({ length: stepsGuitar }).map((_, colIndex) => colIndex);

  function callbackStep(time, col) {
    for (let row = 0; row < noteNamesSharps.length; row++) {
      for (let oct = min; oct <= max; oct++) {
        const key = `${row}-${col}-${oct}`;
        if (notesSequence[key]) {
          playNoteAtTime(noteNamesSharps[row], oct, undefined, time);
        }
      }
    }
  }

  Tone.Transport.bpm.value = bpm;

  const seq = new Tone.Sequence(callbackStep, values, "16n");
  seq.loop = loop;
  seq.start(offset);
  Tone.Transport.start();

  return seq;
}

export function playRhythmTrack(chordSlots, strumPattern, bpm, offset = 0, loop = false) {
  const beats = buildBeats(chordSlots, strumPattern);

  const values = Array.from({ length: beats.length }).map((_, i) => i);

  function callbackStep(time, i) {
    const beat = beats[i];
    playChordAtTime(beat.voicing, beat.strumType, time);
  }

  Tone.Transport.bpm.value = bpm;

  const seq = new Tone.Sequence(callbackStep, values, "8n");
  seq.loop = loop;
  seq.start(offset);
  Tone.Transport.start();

  return seq;
}