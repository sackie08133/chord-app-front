import React from "react";
import TriangleMarker from "./FretboardMarkers.jsx";
import FretboardNotes from "./FretboardNotes.jsx";
import { basic } from "./ChordShapes.jsx";
import { shiftVoicing } from "./Utils.jsx";

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
  const voicing = basic.major[2].voicing;
  const shiftedVoicing = shiftVoicing(voicing, 3); // 3 = rootFret, for testing
  
function getPattern(scaleName) {
  return scales[scaleName]?.pattern;
}

function changeScale(scaleName, rootNote, sharpOrFlat) {
  const scaleFormat = getPattern(scaleName)
  const notes = {}
  let semitoneOffset = 0
  notes[0] = getNoteName(semitoneOffset, rootNote, sharpOrFlat)

  scaleFormat.forEach((interval, index) => {
    semitoneOffset += interval
    notes[index + 1] = getNoteName(semitoneOffset, rootNote, sharpOrFlat)
  })

  return notes
}



  return (
    <svg
      width="80%"
      height="auto"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
    >
      {/* Top line */}
      <line
        x1={0}
        x2={endX}
        y1={fretboardTopY}
        y2={fretboardTopY}
        stroke="black"
        strokeWidth="2"
      />

      {/* String lines */}
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

      {/* Fret lines */}
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

      {/* Bottom line */}
      <line
        x1={0}
        x2={endX}
        y1={fretboardBottomY}
        y2={fretboardBottomY}
        stroke="black"
        strokeWidth="2"
      />

      {/*Fretboard markers */}
      {fretboardMarkerPos.map((x, i) => (
        <g key={`marker-${i}`} opacity={0.7}>
          <g transform={`translate(${x}, ${markerY})`}>
            <TriangleMarker w="30" h="100" direction="right" color="gray" />
          </g>
        </g>
      ))}

      {/* Note circles */}
      {StringsStandard.map((string, stringIndex) =>
        fretPos.map((_, fretNumber) => (
          <FretboardNotes
            key={`${stringIndex}-${fretNumber}`}
            expectedFret={shiftedVoicing[stringIndex]}
            stringIndex={stringIndex}
            fretNumber={fretNumber}
          />
        )),
      )}
    </svg>
  );
}

export default Fretboard;
