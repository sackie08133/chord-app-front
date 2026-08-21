import React from "react";
import TriangleMarker from "./FretboardMarkers.jsx";
import FretboardNotes from "./FretboardNotes.jsx";
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
} from "./Constants.jsx";

function Fretboard({ voicing = [], rootNote, chordType, shapeId, selectedShape }) {
  return (
    <svg
      style={{ width: "100%", height: "auto" }}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="xMidYMid meet"
      aria-label={`Fretboard for ${rootNote} ${chordType}`}
      role="img"
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
            expectedFret={voicing[stringIndex]}
            stringIndex={stringIndex}
            fretNumber={fretNumber}
            rootNote={rootNote}
            chordType={chordType}
            shapeId={shapeId}
            selectedShape={selectedShape}
          />
        ))
      )}
    </svg>
  );
}

export default Fretboard;