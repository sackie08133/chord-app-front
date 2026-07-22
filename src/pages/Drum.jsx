import "./Drum.css"
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { playNote } from '../components/ChordPlayer';

function Drum() {
    const navigate = useNavigate()
    const [activeCells, setActiveCells] = useState({})
    const steps = 16;
    const drumSynthTypes = ['membrane', 'snare', 'hihat'] // membrane === kick

    const toggleCell = (row, col) => {
        const key = `${row}-${col}`
        setActiveCells(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    function playDrumSound(drumType) {
        playNote(null, null, drumSynthTypes[drumType])
    }

    function makeDivArray(rowIndex) {
        return Array.from({ length: steps }).map((_, colIndex) => {
            const key = `${rowIndex}-${colIndex}`
            const wasActive = activeCells[key]
            return (
                <div
                    className={`drum-shot ${activeCells[key] ? 'active' : ''}`}
                    key={key}
                    onClick={() => {
                        toggleCell(rowIndex, colIndex)
                        if (!wasActive) {
                            playDrumSound(rowIndex)
                        }
                    }}
                ></div>
            )
        })
    }

    return (
        <div className='drum-page'>
            <div className='drum-header'>
                <button
                    className="drum-back-button"
                    onClick={() => {
                        navigate(-1)
                    }}> Back </button>
            </div>

            <div className='drum-sequencer'>
                <div className='drum-type' id='kick'>
                    {makeDivArray(0)}
                </div>
                <div className='drum-type' id='snare'>
                    {makeDivArray(1)}
                </div>
                <div className='drum-type' id='hi-hat'>
                    {makeDivArray(2)}
                </div>
            </div>
        </div>
    )
}

export default Drum;