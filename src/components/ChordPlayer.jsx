import * as Tone from "tone";
import { StringsStandard } from "./Constants";
import { getNoteName, getOctave } from "./Utils";

const sampleRoot = `${import.meta.env.BASE_URL}samples/`;

function recordedNotes(midiNotes) {
  return Object.fromEntries(midiNotes.map((note) => [note, `${note}.mp3`]));
}

const mixer = Object.fromEntries(["drum", "bass", "rhythm", "lead"].map((lane) => {
  const pan = new Tone.Panner(0).toDestination();
  const volume = new Tone.Gain(1).connect(pan);
  return [lane, { volume, pan }];
}));

export function setLaneMix(lane, { volume, pan }) {
  mixer[lane].volume.gain.rampTo(volume / 100, 0.03);
  mixer[lane].pan.pan.rampTo(pan / 100, 0.03);
}

const leadGuitarBus = new Tone.Compressor({
  threshold: -20,
  ratio: 3,
  attack: 0.003,
  release: 0.15,
}).connect(mixer.lead.volume);

export const guitarSampler = new Tone.Sampler({
  urls: recordedNotes([
    36, 40, 41, 45, 48, 50, 52, 55, 59, 61, 64, 67, 71, 72, 74, 77, 80, 82, 85,
  ]),
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
}).connect(mixer.rhythm.volume);

const rhythmGuitarSampler = new Tone.Sampler({
  urls: recordedNotes([
    40, 43, 46, 49, 52, 55, 58, 61, 64, 68, 71, 74, 77, 80, 83,
  ]),
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
}).connect(mixer.bass.volume);

export const bassSampler = new Tone.Sampler({
  urls: recordedNotes([
    21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60,
  ]),
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
}).connect(mixer.drum.volume);

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
