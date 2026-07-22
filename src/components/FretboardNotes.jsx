import { StringsStandard, Notes, fretPos, startX } from "./Constants.jsx";
import * as Tone from "tone";
import { useState } from "react";
import { getOctave } from "./Utils.jsx";
import { basic } from "./ChordShapes.jsx";

const FretboardNotes = ({ stringIndex, fretNumber, expectedFret }) => {
  const [isHovered, setIsHovered] = useState(false);
  if (expectedFret !== undefined && fretNumber !== expectedFret) {
    return null;
  }

  const chromScaleNum = StringsStandard[stringIndex].chromScaleNum;
  const noteIndex = (chromScaleNum + fretNumber) % 12;
  const noteName = Notes[noteIndex][0]; // 0 for sharps, 1 for flats
  const fretMidPoint =
    fretPos[fretNumber - 1] +
    (fretPos[fretNumber] - fretPos[fretNumber - 1]) / 2;
  const fretYPos = 70 + stringIndex * 30;

  const synth = new Tone.PolySynth(Tone.Synth).toDestination();
  let noteOctave = getOctave(stringIndex, fretNumber);

  return (
    <g
      onClick={() => {
        synth.triggerAttackRelease(noteName + noteOctave, "8n");
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <circle
        fill={isHovered ? "blue" : "skyblue"}
        cx={fretNumber === 0 ? startX - 80 : fretMidPoint}
        cy={fretYPos}
        r="13"
      />

      <text
        x={fretNumber === 0 ? startX - 80 : fretMidPoint}
        y={fretYPos}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {noteName}
      </text>
    </g>
  );
};

export default FretboardNotes;
