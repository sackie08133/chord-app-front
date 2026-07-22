import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './LeadGuitar.css'
import { noteNamesSharps,noteNamesFlats } from '../components/Constants';
import { playNote } from '../components/ChordPlayer';

const steps = 32

function LeadGuitar() {
    const [octave, setOctave] = useState(1)
    const navigate = useNavigate()
    const [activeCells, setActiveCells] = useState({})
    const bIndex = noteNamesSharps.indexOf('B')

    const toggleCell = (row, col) => {
        const key = `${row}-${col}`
        setActiveCells(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    function playColumn(colIndex) {
        for (let i = 0;  i < noteNamesSharps.length; i++) {
            const key = `${i}-${colIndex}`
            if (activeCells[key]) {
                playNote(noteNamesSharps[i], octave)
            }
        }
    }

    return (
        <div className='lead-page'>
            <div className='lead-header'>
                <button className="lead-back-button" onClick={() => navigate(-1)}>Back</button>
                <div className="lead-fader-group">
                    <label>Volume</label>
                    <input type="range" min="0" max="100" />
                    <label>Pan</label>
                    <input type="range" min="-100" max="100" />
                </div>
                <button className="lead-octave-button" onClick={() => setOctave(octave - 1)}>Octave -</button>
                <button className="lead-octave-button" onClick={() => setOctave(octave + 1)}>Octave +</button>
                <button className="lead-save-button">Save</button>
            </div>

            <div className='lead-piano-roll'>
                <div className="lead-note-names">
                    {noteNamesSharps.map((note, rowIndex) => (
                        <div key={note}>{note}{rowIndex < bIndex ? octave + 1: octave}</div>
                    ))}
                </div>

                <div className="lead-grid-container">
                    {noteNamesSharps.map((note, rowIndex) => (
                        Array.from({ length: steps }).map((_, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`lead-grid-cell ${activeCells[`${rowIndex}-${colIndex}`] ? 'active' : ''}`}
                                onClick={() => {
                                    toggleCell(rowIndex, colIndex)
                                    playNote(note, octave)
                                }}
                            />
                        ))
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LeadGuitar;