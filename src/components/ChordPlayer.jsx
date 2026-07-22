import { basic } from "./ChordShapes";
import { StringsStandard } from "./Constants";
import { getOctave, shiftVoicing } from "./Utils";
import * as Tone from "tone";
import { getNoteName } from "./Utils";

const polysynth = new Tone.PolySynth(Tone.Synth).toDestination()
const membraneSynth = new Tone.MembraneSynth().toDestination()

// Snare: short noise burst with a bit of body
const snareSynth = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: { attack: 0.001, decay: 0.15, sustain: 0 },
}).toDestination();

// HiHat: very short, bright noise, filtered to sound thinner/tighter
const hihatFilter = new Tone.Filter(7000, "highpass").toDestination();
const hihatSynth = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: { attack: 0.001, decay: 0.05, sustain: 0 },
}).connect(hihatFilter);

const synth = {
  poly: polysynth,
  membrane: membraneSynth,
  snare: snareSynth,
  hihat: hihatSynth,
}

// plays the parameter chordVoicing
function playChord(chordVoicing) {
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

export function playNote(noteName, octave, synthType = "poly") {
  const synth = synths[synthType];

  if (!synth) {
    console.error(`Unknown synth type: ${synthType}`);
    return;
  }

  if (synthType === "snare" || synthType === "hihat") {
    // NoiseSynth has no pitch — just trigger a hit
    synth.triggerAttackRelease("8n");
  } else {
    synth.triggerAttackRelease(noteName + octave, "8n");
  }
}



export default playChord;
