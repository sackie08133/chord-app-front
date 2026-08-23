import React, { useMemo, useState, useEffect } from "react"
import Fretboard from "../components/Fretboard"
import { chordShapes, chordProgressions } from "../components/ChordShapes"
import { shiftVoicing } from "../components/Utils"
import { useNavigate, useParams } from "react-router-dom"
import { apiRequest, fetchBpm } from "../components/Utils"
import { useAuth } from "../components/Context"

import "./RhythmGuitar.css"

const rootFretMap = {
  C: 8, "C#/Db": 9, D: 10, "D#/Eb": 11, E: 0, F: 1,
  "F#/Gb": 2, G: 3, "G#/Ab": 4, A: 5, "A#/Bb": 6, B: 7,
}
const ROOT_OPTIONS = Object.keys(rootFretMap)
const strummingSteps = 8

const chordTypeToFamily = {
  maj: "major", maj7: "seventh", "7": "seventh", m7: "seventh",
  mMaj7: "seventh", "6": "sixth", m6: "sixth", sus2: "suspended",
  sus4: "suspended", "11": "extended", m11: "extended",
}
const CHORD_TYPE_OPTIONS = Object.keys(chordTypeToFamily);

const strumTypes =['rest', 'down', 'up', 'muted']
const strumSymbols = {
    down: '↓',
    up: '↑',
    muted: '✕',
    rest: ''
}

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
  if (!familyName || !chordShapes[familyName]) return null
  const chord = chordShapes[familyName].find((item) => item.name === chordType)
  if (!chord) return null
  return chord.shapes.find((shape) => shape.id === shapeId) || null
}

function firstShapeIdForType(allShapeOptions, chordType) {
  const match = allShapeOptions.find((shape) => shape.chordType === chordType)
  return match ? match.shapeId : null
}

let slotIdCounter = 0
function nextSlotId() {
  slotIdCounter += 1
  return `chord-slot-${slotIdCounter}`
}

function createSlot(allShapeOptions, { root = "C", chordType = "maj7" } = {}) {
  return {
    id: nextSlotId(),
    root,
    chordType,
    shapeId: firstShapeIdForType(allShapeOptions, chordType),
    volume: 80,   // 0–100, map to dB/gain wherever this feeds Tone.js
    panning: 0,   // -100 (full L) to 100 (full R)
    locked: false,
  };
}

function RhythmGuitar() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [strumPattern, setStrumPattern] = useState({})
  const allShapeOptions = useMemo(() => getAllShapeOptions(), [])
  const {id} = useParams()
  const [bpm, setBPM] = useState(null)
  const [tracks, setTracks] = useState([])

  const [chordSlots, setChordSlots] = useState(() => [
    createSlot(allShapeOptions, { chordType: "maj7" }),
    createSlot(allShapeOptions, { chordType: "7" }),
    createSlot(allShapeOptions, { chordType: "m7" }),
    createSlot(allShapeOptions, { chordType: "sus4" }),
  ])
  

  const [activeSlotId, setActiveSlotId] = useState(() => chordSlots[0]?.id ?? null)

  const activeSlot = useMemo(
    () => chordSlots.find((slot) => slot.id === activeSlotId) || null,
    [chordSlots, activeSlotId]
  )

  const activeShape = useMemo(() => {
    if (!activeSlot) return null;
    return findShape(activeSlot.chordType, activeSlot.shapeId)
  }, [activeSlot])

  const shiftedVoicing = useMemo(() => {
    if (!activeShape || !activeSlot) return [];
    const rootFret = rootFretMap[activeSlot.root] ?? 0
    return shiftVoicing(activeShape.voicing, rootFret)
  }, [activeShape, activeSlot])

  const cycleStrum = (colIndex) => {
    const current = strumPattern[colIndex] || 'rest' // default to rest
    const currentIndex = strumTypes.indexOf(current)
    const nextIndex = (currentIndex + 1) % strumTypes.length
    const next = strumTypes[nextIndex]

    setStrumPattern(prev => ( {
      ...prev,
      [colIndex]: next
    }))
  }

  function makeDivArray() {
    return Array.from({ length: strummingSteps }).map((_, colIndex) => {
        const key = `${colIndex}`
        const current = strumPattern[key] || 'rest'
        return (
            <div
                className={`strum strum-${current}`}
                key={key}
                onClick={() => cycleStrum(key)}
            >
                {strumSymbols[current]}
            </div>
        )
    })
  }

  function updateSlot(slotId, updates) {
    setChordSlots((prev) =>
      prev.map((slot) => (slot.id === slotId ? { ...slot, ...updates } : slot))
    )
  }

  function handleSlotChordTypeChange(slotId, nextType) {
    const nextShapeId = firstShapeIdForType(allShapeOptions, nextType)
    updateSlot(slotId, { chordType: nextType, shapeId: nextShapeId })
  }

  function toggleSlotLock(slotId) {
    setChordSlots((prev) =>
      prev.map((slot) => (slot.id === slotId ? { ...slot, locked: !slot.locked } : slot))
    )
  }

  function addChordSlot() {
    setChordSlots((prev) => [...prev, createSlot(allShapeOptions)])
  }

  function removeChordSlot(slotId) {
    setChordSlots((prev) => {
      const next = prev.filter((slot) => slot.id !== slotId)
      if (activeSlotId === slotId) setActiveSlotId(next[0]?.id ?? null)
      return next;
    })
  }

  const handleSave = async() => {
    const trackTitle = prompt("Drum Track Title?", "Track")

    if (!trackTitle || !id) {
      return alert("Drum track title or track id was not found")
    }

    try {
      const data = await apiRequest(`/rhythm-guitar/${id}`, {
          trackName: trackTitle, 
          chordSlots: chordSlots,
          strumPattern: strumPattern
      }, token)
    } catch (error) {
      alert(error.message)
    }
  }

  const fetchGuitarTracks = async(songId) => {
    try {
      const data = await apiRequest(`/rhythm-guitar/${id}`, null, token, "GET")
      setTracks(data)
    } catch(error) {
      alert(error.message)
    }
  }

  const loadTrack = (trackId) => {
    const selectedTrack = tracks.find(t => t.id === Number(trackId))
    if (!selectedTrack) return 

    setChordSlots(selectedTrack.chord_slots)
    setStrumPattern(selectedTrack.strum_pattern)
  }

  useEffect(() => {
    fetchGuitarTracks(id)
    const loadBPM = async() => {
      const bpmValue = await fetchBpm(id, token)
      setBPM(bpmValue)
    }
    loadBPM()
    }, [token, id])

  return (
    <div className="Rhythm-Guitar">
      <div className="rhythm-guitar-header">
        <button className="rhythm-guitar-back" onClick={() => navigate(-1)}>Back</button>
        <button className="rhythm-guitar-save" onClick = {handleSave}>Save</button>
        <select 
          className="rhythm-guitar-tracks"
          onChange={(e) => loadTrack(e.target.value)}
        > No Tracks
          {tracks.map((track) => {
                    return (
                        <option className="track-options" key={track.id} value={track.id}>
                            {track.name}
                        </option>
                    )
          })}
        </select>

      </div>

      <div className="rhythm-guitar-fretboard">
        {activeSlot ? (
          <Fretboard
            voicing={shiftedVoicing}
            rootNote={activeSlot.root}
            chordType={activeSlot.chordType}
            shapeId={activeSlot.shapeId}
            selectedShape={activeShape}
          />
        ) : (
          <div className="rhythm-guitar-no-chord">No chord selected</div>
        )}
      </div>

      <div className="rhythm-guitar-chord-list">
        {chordSlots.map((slot) => {
          const shapesForType = allShapeOptions.filter((s) => s.chordType === slot.chordType);

          return (
            <div
              key={slot.id}
              className={`rhythm-guitar-chord ${activeSlotId === slot.id ? "active" : ""}`}
            >
              <div className="rhythm-guitar-chord-header">
                <button className="rhythm-guitar-chord-about">?</button>
                <button
                  className={`rhythm-guitar-chord-lock ${slot.locked ? "locked" : ""}`}
                  onClick={() => toggleSlotLock(slot.id)}
                >
                  {slot.locked ? "Locked" : "Lock"}
                </button>
                <button className="rhythm-guitar-chord-select" onClick={() => setActiveSlotId(slot.id)}>
                  Select
                </button>
                <button
                  className="rhythm-guitar-chord-remove"
                  onClick={() => removeChordSlot(slot.id)}
                  disabled={chordSlots.length <= 1}
                >
                  ✕
                </button>
              </div>

              <div className="rhythm-guitar-chord-controls">
                <select
                  value={slot.root}
                  disabled={slot.locked}
                  onChange={(e) => updateSlot(slot.id, { root: e.target.value })}
                >
                  {ROOT_OPTIONS.map((root) => <option key={root} value={root}>{root}</option>)}
                </select>

                <select
                  value={slot.chordType}
                  disabled={slot.locked}
                  onChange={(e) => handleSlotChordTypeChange(slot.id, e.target.value)}
                >
                  {CHORD_TYPE_OPTIONS.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>

                <select
                  value={slot.shapeId ?? ""}
                  disabled={slot.locked}
                  onChange={(e) => updateSlot(slot.id, { shapeId: e.target.value })}
                >
                  {shapesForType.map((shape) => (
                    <option key={shape.shapeId} value={shape.shapeId}>{shape.shapeId}</option>
                  ))}
                </select>
              </div>

              <div className="rhythm-guitar-chord-name">{slot.root} {slot.chordType}</div>

              <div className="rhythm-guitar-chord-faders">
                <label className="rhythm-guitar-fader">
                  Vol
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={slot.volume}
                    onChange={(e) => updateSlot(slot.id, { volume: Number(e.target.value) })}
                  />
                  <span>{slot.volume}</span>
                </label>

                <label className="rhythm-guitar-fader">
                  Pan
                  <input
                    type="range"
                    min={-100}
                    max={100}
                    value={slot.panning}
                    onChange={(e) => updateSlot(slot.id, { panning: Number(e.target.value) })}
                  />
                  <span>
                    {slot.panning === 0 ? "C" : slot.panning < 0 ? `L${Math.abs(slot.panning)}` : `R${slot.panning}`}
                  </span>
                </label>
              </div>
            </div>
          )
        })}

        <button className="rhythm-guitar-chord-add" onClick={addChordSlot}>+ Add chord</button>
      </div>

      <div className="rhythm-guitar-footer">
        <h3>Strumming Pattern</h3>
        <div className="rhythm-guitar-strum-row">
          {makeDivArray()}
        </div>
      </div>
    </div>
  )
}

export default RhythmGuitar