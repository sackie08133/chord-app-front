import React from "react";
import TriangleMarker from "./FretboardMarkers.jsx";
import FretboardNotes from "./FretboardNotes.jsx";
import { chordShapes } from "./ChordShapes.jsx";
import { shiftVoicing, getNoteName } from "./Utils.jsx";

import {
  StringsStandard,
  fretPos,
  fretboardMarkerPos,
  viewBoxWidth,
  viewBoxHeight,
  fretboardTopY,
  fretboardBottomY,
  stringStartY,
  stringSpacing,
  endX,
  markerY,
  scales,
  noteNamesSharps,
  noteNamesFlats
} from "./Constants.jsx";

function Fretboard() {
  const voicing = chordShapes.major[1]?.voicing;
  const shiftedVoicing = voicing ? shiftVoicing(voicing, 3) : [];

  function getPattern(scaleName) {
    return scales[scaleName]?.pattern ?? [];
  }

  function changeScale(scaleName, rootNote, sharpOrFlat = "sharps") {
    const scaleFormat = getPattern(scaleName);
    const notes = {};
    let semitoneOffset = 0;

    notes[0] = getNoteName(semitoneOffset, rootNote, sharpOrFlat);

    scaleFormat.forEach((interval, index) => {
      semitoneOffset += interval;
      notes[index + 1] = getNoteName(semitoneOffset, rootNote, sharpOrFlat);
    });

    return notes;
  }

  return (
    <svg
      width="80%"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
    >
      <line
        x1={0}
        x2={endX}
        y1={fretboardTopY}
        y2={fretboardTopY}
        stroke="black"
        strokeWidth="2"
      />

      {StringsStandard.map((string, i) => (
        <line
          key={`string-${i}`}
          x1={0}
          x2={endX}
          y1={stringStartY + i * stringSpacing}
          y2={stringStartY + i * stringSpacing}
          stroke="black"
          strokeWidth="2"
        />
      ))}

      {fretPos.map((x, i) => (
        <line
          key={`fret-${i}`}
          x1={x}
          x2={x}
          y1={fretboardTopY}
          y2={fretboardBottomY}
          stroke="black"
          opacity={i === 0 ? 1 : 0.5}
          strokeWidth={i === 0 ? 2 : 1}
        />
      ))}

      <line
        x1={0}
        x2={endX}
        y1={fretboardBottomY}
        y2={fretboardBottomY}
        stroke="black"
        strokeWidth="2"
      />

      {fretboardMarkerPos.map((x, i) => (
        <g key={`marker-${i}`} opacity={0.7}>
          <g transform={`translate(${x}, ${markerY})`}>
            <TriangleMarker w="30" h="100" direction="right" color="gray" />
          </g>
        </g>
      ))}

      {StringsStandard.map((string, stringIndex) =>
        fretPos.map((_, fretNumber) => (
          <FretboardNotes
            key={`${stringIndex}-${fretNumber}`}
            expectedFret={shiftedVoicing[stringIndex]}
            stringIndex={stringIndex}
            fretNumber={fretNumber}
          />
        ))
      )}
    </svg>
  );
}

export default Fretboard;