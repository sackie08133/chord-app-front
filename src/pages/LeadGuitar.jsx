import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './LeadGuitar.css'

const noteNames = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#']
const steps = 32

function LeadGuitar() {
    const [octave, setOctave] = useState(1)
    const navigate = useNavigate()
    const [activeCells, setActiveCells] = useState({})

    const toggleCell = (row, col) => {
        const key = `${row}-${col}`
        setActiveCells(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
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
                    {noteNames.map((note) => (
                        <div key={note}>{note}{octave}</div>
                    ))}
                </div>

                <div className="lead-grid-container">
                    {noteNames.map((note, rowIndex) => (
                        Array.from({ length: steps }).map((_, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`lead-grid-cell ${activeCells[`${rowIndex}-${colIndex}`] ? 'active' : ''}`}
                                onClick={() => toggleCell(rowIndex, colIndex)}
                            />
                        ))
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LeadGuitar;