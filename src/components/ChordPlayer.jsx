import * as Tone from "tone";
import { StringsStandard } from "./Constants";
import { getNoteName, getOctave } from "./Utils";

// Tone's monophonic instrument classes sound more convincing than a generic
// oscillator, but one instance cannot play a chord. A small round-robin pool
// preserves polyphony without falling back to Tone.PolySynth.
function createVoicePool(size, createVoice) {
  const voices = Array.from({ length: size }, createVoice);
  let nextVoice = 0;

  return {
    triggerAttackRelease(note, duration, time, velocity) {
      const voice = voices[nextVoice];
      nextVoice = (nextVoice + 1) % voices.length;
      voice.triggerAttackRelease(note, duration, time, velocity);
    },
  };
}

const guitarBus = new Tone.Filter({ frequency: 6200, type: "lowpass", rolloff: -12 });
const guitarCompressor = new Tone.Compressor({ threshold: -18, ratio: 3, attack: 0.005, release: 0.15 });
guitarBus.connect(guitarCompressor);
guitarCompressor.toDestination();

export const guitarSynth = createVoicePool(24, () =>
  new Tone.PluckSynth({
    attackNoise: 1.2,
    dampening: 3800,
    resonance: 0.94,
    release: 1.2,
    volume: -7,
  }).connect(guitarBus),
);

const bassCompressor = new Tone.Compressor({ threshold: -16, ratio: 4, attack: 0.01, release: 0.2 }).toDestination();

export const bassSynth = createVoicePool(8, () =>
  new Tone.MonoSynth({
    oscillator: { type: "fatsawtooth", count: 2, spread: 8 },
    filter: { type: "lowpass", frequency: 700, rolloff: -24, Q: 1.2 },
    envelope: { attack: 0.008, decay: 0.18, sustain: 0.35, release: 0.28 },
    filterEnvelope: {
      attack: 0.004,
      decay: 0.22,
      sustain: 0.15,
      release: 0.25,
      baseFrequency: 90,
      octaves: 3.2,
    },
    volume: -8,
  }).connect(bassCompressor),
);

const kickSynth = new Tone.MembraneSynth({
  pitchDecay: 0.045,
  octaves: 7,
  oscillator: { type: "sine" },
  envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.08 },
  volume: -2,
}).toDestination();

const snareFilter = new Tone.Filter({ frequency: 1500, type: "highpass" }).toDestination();
const snareNoise = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: { attack: 0.001, decay: 0.16, sustain: 0, release: 0.03 },
  volume: -7,
}).connect(snareFilter);
const snareBody = new Tone.MembraneSynth({
  pitchDecay: 0.015,
  octaves: 2,
  envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.02 },
  volume: -10,
}).toDestination();

const hihatSynth = new Tone.MetalSynth({
  frequency: 240,
  harmonicity: 5.1,
  modulationIndex: 32,
  resonance: 5200,
  octaves: 1.5,
  envelope: { attack: 0.001, decay: 0.055, release: 0.015 },
  volume: -13,
}).toDestination();

const instruments = {
  guitar: guitarSynth,
  bass: bassSynth,
};

function triggerDrum(type, time) {
  if (type === "kick") {
    kickSynth.triggerAttackRelease("C1", "8n", time, 0.95);
    return true;
  }
  if (type === "snare") {
    snareNoise.triggerAttackRelease("16n", time, 0.8);
    snareBody.triggerAttackRelease("D2", "32n", time, 0.45);
    return true;
  }
  if (type === "hihat") {
    hihatSynth.triggerAttackRelease("32n", time, 0.45);
    return true;
  }
  return false;
}

function guitarNoteForString(fret, string) {
  return `${getNoteName(fret + StringsStandard[string].chromScaleNum, "C", 0)}${getOctave(string, fret)}`;
}

export function playChord(chordVoicing) {
  const now = Tone.now();
  chordVoicing.forEach((fret, string) => {
    if (fret !== null) {
      guitarSynth.triggerAttackRelease(guitarNoteForString(fret, string), "8n", now + string * 0.012, 0.72);
    }
  });
}

export function playNoteAtTime(noteName, octave, instrument = "guitar", time) {
  if (triggerDrum(instrument, time)) return;

  const synth = instruments[instrument];
  if (!synth) {
    console.error(`Unknown instrument: ${instrument}`);
    return;
  }
  if (noteName == null || octave == null) {
    console.error(`A note and octave are required for ${instrument}`);
    return;
  }

  const duration = instrument === "bass" ? "8n" : "16n";
  const velocity = instrument === "bass" ? 0.8 : 0.65;
  synth.triggerAttackRelease(`${noteName}${octave}`, duration, time, velocity);
}

export function playChordAtTime(chordVoicing, strumType, time) {
  if (strumType === "rest") return;

  const stringOrder = strumType === "up"
    ? [...chordVoicing.entries()].reverse()
    : [...chordVoicing.entries()];
  const duration = strumType === "muted" ? "32n" : "8n";
  const stagger = strumType === "muted" ? 0.001 : 0.012;

  stringOrder.forEach(([string, fret], orderIndex) => {
    if (fret !== null) {
      guitarSynth.triggerAttackRelease(
        guitarNoteForString(fret, string),
        duration,
        time + orderIndex * stagger,
        strumType === "muted" ? 0.5 : 0.72,
      );
    }
  });
}

export default playChord;
