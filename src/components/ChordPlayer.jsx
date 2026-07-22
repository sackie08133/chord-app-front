import { basic } from "./ChordShapes";
import { StringsStandard } from "./Constants";
import { getOctave, shiftVoicing } from "./Utils";
import * as Tone from "tone";
import { getNoteName } from "./Utils";
const polysynth = new Tone.PolySynth(Tone.Synth).toDestination();

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

export default playChord;
