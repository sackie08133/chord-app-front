import * as Tone from "tone";
import { playNoteAtTime } from "./ChordPlayer";
import { drumTypeNames, drumSynthTypes } from "./Constants";

const steps = 16

// function to play a drum track given hits from backend
export function playDrumTrack(hits, bpm, offset = 0, loop = false) {
    const hitsSequence = {}
    for (const hit of hits) {
        const drum = drumTypeNames.indexOf(hit.drum_type)
        const col = hit.col
        const key = `${drum}-${col}`
        hitsSequence[key] = true
    }

    const values = Array.from({ length: steps }).map((_, colIndex) => colIndex) 

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