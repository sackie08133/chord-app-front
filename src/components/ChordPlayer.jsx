import * as Tone from "tone";
import { StringsStandard } from "./Constants";
import { getNoteName, getOctave } from "./Utils";

const sampleRoot = `${import.meta.env.BASE_URL}samples/`;

const leadGuitarBus = new Tone.Compressor({
  threshold: -20,
  ratio: 3,
  attack: 0.003,
  release: 0.15,
}).toDestination();

export const guitarSampler = new Tone.Sampler({
  urls: {
    E2: "E2.mp3",
    A2: "A2.mp3",
    C3: "C3.mp3",
    "F#3": "Fs3.mp3",
    C4: "C4.mp3",
    "F#4": "Fs4.mp3",
    C5: "C5.mp3",
    "F#5": "Fs5.mp3",
    A5: "A5.mp3",
    C6: "C6.mp3",
  },
  baseUrl: `${sampleRoot}guitar-electric/`,
  attack: 0,
  release: 0.35,
  volume: -5,
}).connect(leadGuitarBus);

const rhythmGuitarBus = new Tone.Compressor({
  threshold: -18,
  ratio: 2.5,
  attack: 0.005,
  release: 0.2,
}).toDestination();

const rhythmGuitarSampler = new Tone.Sampler({
  urls: {
    A2: "A2.mp3",
    D3: "D3.mp3",
    G3: "G3.mp3",
    C4: "C4.mp3",
    F4: "F4.mp3",
    C5: "C5.mp3",
    D5: "D5.mp3",
  },
  baseUrl: `${sampleRoot}guitar-acoustic/`,
  attack: 0,
  release: 0.3,
  volume: -7,
}).connect(rhythmGuitarBus);

const bassBus = new Tone.Compressor({
  threshold: -18,
  ratio: 4,
  attack: 0.005,
  release: 0.18,
}).toDestination();

export const bassSampler = new Tone.Sampler({
  urls: {
    E1: "E1.mp3",
    "A#1": "As1.mp3",
    E2: "E2.mp3",
    "A#2": "As2.mp3",
    E3: "E3.mp3",
    "A#3": "As3.mp3",
    E4: "E4.mp3",
    "A#4": "As4.mp3",
  },
  baseUrl: `${sampleRoot}bass-electric/`,
  attack: 0,
  release: 0.25,
  volume: -6,
}).connect(bassBus);

const drumSampler = new Tone.Sampler({
  urls: {
    C1: "kick.wav",
    D1: "snare.wav",
    E1: "hihat.wav",
  },
  baseUrl: `${sampleRoot}drums/`,
  attack: 0,
  release: 0.08,
  volume: -2,
}).toDestination();

const instruments = {
  guitar: guitarSampler,
  bass: bassSampler,
};

const drumNotes = {
  kick: { note: "C1", duration: 0.5, velocity: 0.95 },
  snare: { note: "D1", duration: 0.25, velocity: 0.85 },
  hihat: { note: "E1", duration: 0.1, velocity: 0.65 },
};

function triggerDrum(type, time) {
  const drum = drumNotes[type];
  if (!drum) return false;

  drumSampler.triggerAttackRelease(
    drum.note,
    drum.duration,
    time,
    drum.velocity,
  );
  return true;
}

function guitarNoteForString(fret, string) {
  return `${getNoteName(fret + StringsStandard[string].chromScaleNum, "C", 0)}${getOctave(string, fret)}`;
}

export function playChord(chordVoicing) {
  const now = Tone.now();
  chordVoicing.forEach((fret, string) => {
    if (fret !== null) {
      rhythmGuitarSampler.triggerAttackRelease(
        guitarNoteForString(fret, string),
        "8n",
        now + string * 0.018,
        0.8,
      );
    }
  });
}

export function playNoteAtTime(noteName, octave, instrument = "guitar", time) {
  if (triggerDrum(instrument, time)) return;

  const sampler = instruments[instrument];
  if (!sampler) {
    console.error(`Unknown instrument: ${instrument}`);
    return;
  }
  if (noteName == null || octave == null) {
    console.error(`A note and octave are required for ${instrument}`);
    return;
  }

  const duration = instrument === "bass" ? "8n" : "16n";
  sampler.triggerAttackRelease(
    `${noteName}${octave}`,
    duration,
    time,
    instrument === "bass" ? 0.9 : 0.78,
  );
}

export function playChordAtTime(chordVoicing, strumType, time) {
  if (strumType === "rest") return;

  const stringOrder = strumType === "up"
    ? [...chordVoicing.entries()].reverse()
    : [...chordVoicing.entries()];
  const duration = strumType === "muted" ? "32n" : "8n";
  const stagger = strumType === "muted" ? 0.003 : 0.018;

  stringOrder.forEach(([string, fret], orderIndex) => {
    if (fret !== null) {
      rhythmGuitarSampler.triggerAttackRelease(
        guitarNoteForString(fret, string),
        duration,
        time + orderIndex * stagger,
        strumType === "muted" ? 0.55 : 0.8,
      );
    }
  });
}

export default playChord;
