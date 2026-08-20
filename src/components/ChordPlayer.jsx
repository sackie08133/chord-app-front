import { chordShapes } from "./ChordShapes";
import { StringsStandard } from "./Constants";
import { getOctave, shiftVoicing } from "./Utils";
import * as Tone from "tone";
import { getNoteName } from "./Utils";

export const polysynth = new Tone.PolySynth(Tone.Synth).toDestination()
export const membraneSynth = new Tone.MembraneSynth({
  envelope: { attack: 0.01, decay: 0.01, sustain: 0, release: 0.1 }
}).toDestination()
membraneSynth.volume.value = 6 // boost by 6 dB, adjust to taste

export const snareSynth = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: { attack: 0.001, decay: 0.15, sustain: 0 },
}).toDestination();

// HiHat: very short, bright noise, filtered to sound thinner/tighter
export const hihatFilter = new Tone.Filter(4000, "highpass").toDestination();
export const hihatSynth = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: { attack: 0.001, decay: 0.05, sustain: 0 },
}).connect(hihatFilter);

const synths = {
  poly: polysynth,
  membrane: membraneSynth,
  snare: snareSynth,
  hihat: hihatSynth,
}

// plays the parameter chordVoicing
export function playChord(chordVoicing) {
  const now = Tone.now();
  chordVoicing.forEach((fret, string) => {
    if (fret === null) {
      return;
    }
    const octave = getOctave(string, fret);
    const noteName = getNoteName(
      fret + StringsStandard[string].chromScaleNum,
      "C",
      0,
    );
    polysynth.triggerAttackRelease(noteName + octave, "8n", now + string * 0.1); // add delay to replicate strum
  });
}

export function playNoteAtTime(noteName, octave, synthType = "poly", time = undefined) {
  const synth = synths[synthType];

  if (!synth) {
    console.error(`Unknown synth type: ${synthType}`);
    return;
  }

  if (synthType === "snare" || synthType === "hihat" || synthType === "membrane") {
    // NoiseSynth has no pitch — just trigger a hit
    synth.triggerAttackRelease("8n",time)
  } else {
    synth.triggerAttackRelease(noteName + octave, "8n", time);
  }
}



export default playChord;
