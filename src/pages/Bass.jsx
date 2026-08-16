import { useState} from 'react'
import { useAuth } from '../components/Context';
import { useNavigate, useParams } from "react-router-dom";
import './Bass.css'
import {playNoteAtTime} from '../components/ChordPlayer';
import { apiRequest } from '../components/Utils';
import { noteNamesFlats, noteNamesSharps } from '../components/Constants';
import {fetchBpm} from '../components/Utils'

const steps = 32

function Bass() {
    const [octave, setOctave] = useState(1)
    const navigate = useNavigate()
    const [activeCells, setActiveCells] = useState({})
    const bIndex = noteNamesSharps.indexOf('B')
    const {id} = useParams()
    const {token, setToken} = useAuth()

    const toggleCell = (row, col) => {
        const key = `${row}-${col}`
        setActiveCells(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
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
    

    return (
        <div className='bass-page'>
            <div className='bass-header'>
                <button className="bass-back-button" onClick={() => navigate(-1)}>Back</button>
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
            </div>

            <div className='bass-piano-roll'>
                <div className="bass-note-names">
                    {
                    noteNamesSharps.map((note, rowIndex) => (  
                        <div key={note}>{note}{rowIndex < bIndex ? octave + 1: octave}</div>
                    ))}
                </div>

                <div className="bass-grid-container">
                    {noteNamesSharps.map((note, rowIndex) => (
                        Array.from({ length: steps }).map((_, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`bass-grid-cell ${activeCells[`${rowIndex}-${colIndex}`] ? 'active' : ''}`}
                                onClick={() => {
                                    toggleCell(rowIndex, colIndex)
                                    playNoteAtTime(note, octave, 'poly', '8n')
                                }}
                            />
                        ))
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Bass;