import * as Tone from "tone";
import { playNoteAtTime, playChordAtTime } from "./ChordPlayer";
import { drumTypeNames, drumSynthTypes, noteNamesSharps, instrumentRanges } from "./Constants";
import { buildBeats } from "../pages/RhythmGuitar";

const stepsDrums = 16
const stepsGuitar = 32

export function playDrumTrack(hits, bpm, offset = 0, loop = false) {
    const hitsSequence = {}
    for (const hit of hits) {
        const drum = drumTypeNames.indexOf(hit.drum_type)
        const col = hit.col
        const key = `${drum}-${col}`
        hitsSequence[key] = true
    }

    const values = Array.from({ length: stepsDrums }).map((_, colIndex) => colIndex)

    function callbackStep(time, col) {
        for (let row = 0; row < drumTypeNames.length; row++) {
            const key = `${row}-${col}`
            if (hitsSequence[key]) {
                playNoteAtTime(null, null, drumSynthTypes[row], time)
            }
        }
    }

    Tone.Transport.bpm.value = bpm

    const seq = new Tone.Sequence(callbackStep, values, "16n")
    seq.loop = loop
    seq.start(offset)
    Tone.Transport.start()

    return seq
}

export function playGuitarTrack(notes, bpm, offset = 0, loop = false, instrument = "guitar") {
    const notesSequence = {}
    for (const note of notes) {
        const row = noteNamesSharps.indexOf(note.row)
        const col = note.col
        const octave = note.octave
        const key = `${row}-${col}-${octave}`
        notesSequence[key] = true
    }

    const { min, max } = instrumentRanges[instrument]

    const values = Array.from({ length: stepsGuitar }).map((_, colIndex) => colIndex)

    function callbackStep(time, col) {
        for (let row = 0; row < noteNamesSharps.length; row++) {
            for (let oct = min; oct <= max; oct++) {
                const key = `${row}-${col}-${oct}`
                if (notesSequence[key]) {
                    console.log('triggering', noteNamesSharps[row], oct, 'at time', time)
                    playNoteAtTime(noteNamesSharps[row], oct, undefined, time)
                }
            }
        }
    }

    Tone.Transport.bpm.value = bpm

    const seq = new Tone.Sequence(callbackStep, values, "16n")
    seq.loop = loop
    seq.start(offset)
    Tone.Transport.start()

    return seq
}

export function playRhythmTrack(chordSlots, strumPattern, bpm, offset = 0, loop = false) {
    const beats = buildBeats(chordSlots, strumPattern)

    const values = Array.from({ length: beats.length }).map((_, i) => i)

    function callbackStep(time, i) {
        const beat = beats[i]
        playChordAtTime(beat.voicing, beat.strumType, time)
    }

    Tone.Transport.bpm.value = bpm

    const seq = new Tone.Sequence(callbackStep, values, "8n")
    seq.loop = loop
    seq.start(offset)
    Tone.Transport.start()

    return seq
}