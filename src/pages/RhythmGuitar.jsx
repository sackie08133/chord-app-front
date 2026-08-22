import React, { useMemo, useState } from "react";
import Fretboard from "../components/Fretboard";
import { chordShapes, chordProgressions } from "../components/ChordShapes";
import { shiftVoicing } from "../components/Utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/Context";
import "./RhythmGuitar.css";

const rootFretMap = {
  C: 8,
  "C#/Db": 9,
  D: 10,
  "D#/Eb": 11,
  E: 0,
  F: 1,
  "F#/Gb": 2,
  G: 3,
  "G#/Ab": 4,
  A: 5,
  "A#/Bb": 6,
  B: 7,
};

const chordTypeToFamily = {
  maj: "major",
  maj7: "seventh",
  "7": "seventh",
  m7: "seventh",
  mMaj7: "seventh",
  "6": "sixth",
  m6: "sixth",
  sus2: "suspended",
  sus4: "suspended",
  "11": "extended",
  m11: "extended",
};

function getAllShapeOptions() {
  const out = [];
  for (const family of Object.values(chordShapes)) {
    for (const chord of family) {
      for (const shape of chord.shapes) {
        out.push({
          label: `${chord.name} — ${shape.id}`,
          chordType: chord.name,
          shapeId: shape.id,
          familyName: chordTypeToFamily[chord.name] || "",
        })
      }
    }
  }
  return out
}

function findShape(chordType, shapeId) {
  const familyName = chordTypeToFamily[chordType]
  if (!familyName || !chordShapes[familyName]) return null;

  const chord = chordShapes[familyName].find((item) => item.name === chordType)
  if (!chord) return null

  return chord.shapes.find((shape) => shape.id === shapeId) || null
}


function RhythmGuitar() {
  const navigate = useNavigate()
  const { token } = useAuth()

  const allShapeOptions = useMemo(() => getAllShapeOptions(), [])

  const [selectedRoot, setSelectedRoot] = useState("C")
  const [selectedChordType, setSelectedChordType] = useState("maj7")
  const [selectedShapeId, setSelectedShapeId] = useState("maj7-6-root")

  const selectedShape = useMemo(() => {
    return findShape(selectedChordType, selectedShapeId);
  }, [selectedChordType, selectedShapeId])

  const shiftedVoicing = useMemo(() => {
    if (!selectedShape) return [];
    const rootFret = rootFretMap[selectedRoot] ?? 0;
    return shiftVoicing(selectedShape.voicing, rootFret)
  }, [selectedShape, selectedRoot])

  const filteredShapes = useMemo(() => {
    return allShapeOptions.filter((shape) => shape.chordType === selectedChordType)
  }, [allShapeOptions, selectedChordType])

  const handleChordTypeChange = (e) => {
    const nextType = e.target.value
    setSelectedChordType(nextType)

    const nextOptions = allShapeOptions.filter((shape) => shape.chordType === nextType)
    if (nextOptions.length > 0) {
      setSelectedShapeId(nextOptions[0].shapeId)
    }
  }

  const handleShapeChange = (e) => {
    setSelectedShapeId(e.target.value)
  }

  function returnChordProgression() {

  }

  return (
    <div className="Rhythm-Guitar">
      <div className="rhythm-guitar-header">
        <button className="rhythm-guitar-back" onClick={() => navigate(-1)}>
          Back
        </button>

        <button className="rhythm-guitar-save">Save</button>
        <button className="rhythm-guitar-about">About</button>

        <select
          id="root-dropdown"
          value={selectedRoot}
          onChange={(e) => setSelectedRoot(e.target.value)}
        >
          <option>C</option>
          <option>C#/Db</option>
          <option>D</option>
          <option>D#/Eb</option>
          <option>E</option>
          <option>F</option>
          <option>F#/Gb</option>
          <option>G</option>
          <option>G#/Ab</option>
          <option>A</option>
          <option>A#/Bb</option>
          <option>B</option>
        </select>

        <select
          id="chord-type-dropdown"
          value={selectedChordType}
          onChange={handleChordTypeChange}
        >
          <option value="maj">maj</option>
          <option value="maj7">maj7</option>
          <option value="7">7</option>
          <option value="m7">m7</option>
          <option value="mMaj7">mMaj7</option>
          <option value="6">6</option>
          <option value="m6">m6</option>
          <option value="sus2">sus2</option>
          <option value="sus4">sus4</option>
          <option value="11">11</option>
          <option value="m11">m11</option>
        </select>

        <select
          id="shape-dropdown"
          value={selectedShapeId}
          onChange={handleShapeChange}
        >
          {filteredShapes.map((shape) => (
            <option key={shape.shapeId} value={shape.shapeId}>
              {shape.shapeId}
            </option>
          ))}
        </select>
      </div>

      <div className="rhythm-guitar-fretboard">
        <Fretboard
          voicing={shiftedVoicing}
          rootNote={selectedRoot}
          chordType={selectedChordType}
          shapeId={selectedShapeId}
          selectedShape={selectedShape}
        />
      </div>

      <div className="rhythm-guitar-chord-list">
        {["maj7", "7", "m7", "sus4"].map((type) => {
          const previewShape = allShapeOptions.find((shape) => shape.chordType === type);
          return (
            <div
              key={type}
              className={`rhythm-guitar-chord ${selectedChordType === type ? "active" : ""}`}
              onClick={() => {
                setSelectedChordType(type);
                const nextOptions = allShapeOptions.filter((shape) => shape.chordType === type);
                if (nextOptions.length > 0) setSelectedShapeId(nextOptions[0].shapeId);
              }}
            >
              <div className="rhythm-guitar-chord-header">
                <button className="rhythm-guitar-chord-about">?</button>
                <button className="rhythm-guitar-chord-lock">Lock</button>
                <button className = "rhythm-guitar-chord-select">Select</button>
              </div>
              <div className="rhythm-guitar-chord-name">{type}</div>
            </div>
          );
        })}
      </div>

      <div className="rhythm-guitar-footer">
        <div className="rhythm-guitar-strumming-pattern">Strumming Pattern</div>
        <div className="rhythm-guitar-volume-panning-fader">Volume and Panning</div>
      </div>
    </div>
  );
}

export default RhythmGuitar;