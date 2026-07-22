import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './Bass.css'

const noteNames = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#']
const steps = 32

function Bass() {
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
        <div className='bass-page'>
            <div className='bass-header'>
                <button className="bass-back-button" onClick={() => navigate(-1)}>Back</button>
                <div className="bass-fader-group">
                    <label>Volume</label>
                    <input type="range" min="0" max="100" />
                    <label>Pan</label>
                    <input type="range" min="-100" max="100" />
                </div>
                <button className="bass-octave-button" onClick={() => setOctave(octave - 1)}>Octave -</button>
                <button className="bass-octave-button" onClick={() => setOctave(octave + 1)}>Octave +</button>
                <button className="bass-save-button">Save</button>
            </div>

            <div className='bass-piano-roll'>
                <div className="bass-note-names">
                    {noteNames.map((note) => (
                        <div key={note}>{note}{octave}</div>
                    ))}
                </div>

                <div className="bass-grid-container">
                    {noteNames.map((note, rowIndex) => (
                        Array.from({ length: steps }).map((_, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`bass-grid-cell ${activeCells[`${rowIndex}-${colIndex}`] ? 'active' : ''}`}
                                onClick={() => toggleCell(rowIndex, colIndex)}
                            />
                        ))
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Bass;