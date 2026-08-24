import { useState, useEffect, useRef} from 'react'
import { useAuth } from '../components/Context';
import { useNavigate, useParams } from "react-router-dom";
import './Bass.css'
import {playNoteAtTime} from '../components/ChordPlayer';
import { apiRequest } from '../components/Utils';
import { noteNamesFlats, noteNamesSharps } from '../components/Constants';
import {fetchBpm} from '../components/Utils'
import { playGuitarTrack } from '../components/Playback';
import * as Tone from "tone"

const steps = 32

function Bass() {
    const [octave, setOctave] = useState(1)
    const navigate = useNavigate()
    const [bpm, setBPM] = useState(null)
    const [tracks, setTracks] = useState([])
    const [activeCells, setActiveCells] = useState({})
    const bIndex = noteNamesSharps.indexOf('B')
    const {id} = useParams()
    const {token, setToken} = useAuth()
    const seqRef = useRef(null)

    const toggleCell = (row, col, oct) => {
        const key = `${row}-${col}-${oct}`
        setActiveCells(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    export const fetchBassTracks = async(songId) => {
        try {
            const data = await apiRequest(`/guitar-tracks/${id}`, null, token, "GET")   
            setTracks(data)
        } catch (error) {
            alert(error.message)
        }
    }


    const fetchBassNotes = async (trackId) => {
            try {
                const data = await apiRequest(
                    `/guitar-tracks/${trackId}/notes`, null, token, "GET")
    
                const loadedCells = {}
                for (const note of data) {
                    const row = noteNamesSharps.indexOf(note.row)
                    const key = `${row}-${note.col}-${note.octave}`
                    loadedCells[key] = true
                    
                }
            setActiveCells(loadedCells)
            } catch (error) {
                alert(error.message)
            }
    }

    const handleSave = async() => {
            const trackTitle = prompt("Guitar Track Title?", "Track")
            const guitarNotesArray = makeGuitarNotesArray()
    
            if (!id || !trackTitle || guitarNotesArray.length === 0) {
                return alert("Song id, track title, or guitar hits failed to save")
            }
    
            try {
                const data = await apiRequest('/guitar-tracks', {
                    song_id: id,
                    track_name: trackTitle,
                    guitar_notes: guitarNotesArray,
                    instrument: "bass"
                }, token)
            } catch (error) {
                alert(error.message)
            }
        }

    function playColumn(colIndex) {
      for (let i = 0; i < noteNamesSharps.length; i++) {
        const key = `${i}-${colIndex}`
        if (activeCells[key]) {
            playNoteAtTime(noteNamesSharps[i], octave, "poly", "8n")
        }
      }
    }

    function makeGuitarNotesArray() {
            return Object.keys(activeCells) // gets the property name of active cells "1-2, 2-1" from {"2-1" :true, "2-3: false"}
                .filter((key) => activeCells[key]) // filter out all the trues 
                    .map((key) => {
                        const [row, col, oct] = key.split("-")
                        return {
                            row: noteNamesSharps[row],
                            col: Number(col),
                            octave: Number(oct)
                        }
                    })  
    }

    useEffect(() => {
        fetchBassTracks(id)
        const loadBPM = async() => {
            const bpmValue = await fetchBpm(id, token)
            setBPM(bpmValue)
        }
        loadBPM()
        }, [token, id])

    useEffect(() => {
        return () => {
        if (seqRef.current) {
            seqRef.current.stop()
            seqRef.current.dispose()
            seqRef.current = null
        }
        Tone.Transport.stop()
        Tone.Transport.cancel()
        }
    }, [])
    

    return (
        <div className='bass-page'>
            <div className='bass-header'>
                <button className="bass-back-button" onClick={() => navigate(-1)}>Back</button>
                <button
                    id="bass-play-all-button"
                    disabled = {!bpm}
                    onClick={async () => {
                        if (seqRef.current) {
                            seqRef.current.stop()
                            seqRef.current.dispose()
                            seqRef.current = null
                            Tone.Transport.stop()
                        }

                        await Tone.start()
                        const notes = makeGuitarNotesArray()
                        const seq = playGuitarTrack(makeGuitarNotesArray(), bpm, 0, false, "bass")
                        seqRef.current = seq
                    }}
                >Play All</button>

                <button
                    id="bass-loop-button"
                    disabled = {!bpm}
                    onClick={async () => {
                        if (seqRef.current) { 
                        // prevent infinite playback from single reqRef, make fully play or stopped before allowing using reqRef on other buttons
                        // Tradeoff: no need for 2 seperate seqRef, however prevents infinite, unstoppable playback
                            seqRef.current.stop()
                            seqRef.current.dispose()
                            seqRef.current = null
                            Tone.Transport.stop()
                            return
                        }

                        await Tone.start()
                        const seq = playGuitarTrack(makeGuitarNotesArray(), bpm, 0, true, "bass")
                        seqRef.current = seq
                    }}
                >{seqRef.current ? "Stop" : "Loop"}</button>

                <div className="bass-fader-group">
                    <label>Volume</label>
                    <input type="range" min="0" max="100" />
                    <label>Pan</label>
                    <input type="range" min="-100" max="100" />
                </div>
                <button 
                    className="bass-octave-button" 
                    onClick={() => setOctave(octave - 1)}>Octave -</button>
                <button 
                    className="bass-octave-button" 
                    onClick={() => setOctave(octave + 1)}>Octave +</button>
                <button 
                    className="bass-save-button"
                    onClick= {handleSave}
                >Save</button>

                <select
                    id="bass-show-tracks-button"
                    onChange={(e) => fetchBassNotes(e.target.value)}
                > Delete
                    {tracks.map((track) => {
                    return (
                        <option className="track-options" key={track.id} value={track.id}>
                            {track.name}
                        </option>
                    )
                    })}
                </select>
            </div>

            <div className='bass-piano-roll'>
                <div className="bass-note-names">
                    {
                    noteNamesSharps.map((note, rowIndex) => (  
                        <div key={note}>{note}{rowIndex < bIndex ? octave + 1: octave}</div>
                    ))}
                </div>

                <div className="bass-grid-container">
                    {noteNamesSharps.map((note, rowIndex) => {
                        const rowOctave = rowIndex < bIndex ? octave + 1 : octave
                        return Array.from({ length: steps }).map((_, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}-${rowOctave}`}
                                className={`bass-grid-cell ${activeCells[`${rowIndex}-${colIndex}-${rowOctave}`] ? 'active' : ''}`}
                                onClick={() => {
                                    toggleCell(rowIndex, colIndex, rowOctave)
                                    playNoteAtTime(note, rowOctave, 'poly')
                                }}
                            />
                        ))
                    })}
                </div>
            </div>
        </div>
    )
}

export default Bass;