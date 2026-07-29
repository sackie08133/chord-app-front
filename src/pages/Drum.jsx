import "./Drum.css"
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { playNote } from '../components/ChordPlayer';

function Drum() {
    const navigate = useNavigate()
    const [activeCells, setActiveCells] = useState({})
    const steps = 16;
    const drumSynthTypes = ['membrane', 'snare', 'hihat'] // membrane === kick
    const drumTypeNames = ['kick', 'snare', 'hihat']
    console.log('current activeCells:', activeCells)

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

    function makeDrumHitArray() {
        return Object.keys(activeCells) // gets the property name of active cells "1-2, 2-1" from {"2-1" :true, "2-3: false"}
            .filter((key) => activeCells[key]) // filter out all the trues 
                .map((key) => {
                    const [row, col] = key.split("-")
                    return {
                        drum_type: drumTypeNames[row],
                        col: Number(col)
                    }
                })  
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
                <button
                    className = "drum-play-all-button"
                    onClick = {() => {
                        console.log("Play-All")
                    }} 
                    >Play All</button>
                <button
                    className = "drum-loop-button"
                    onClick = {() => {
                        console.log("Loop")
                    }}>Loop</button>
                <button
                    className = "drum-save-button"
                    onClick= {() => {
                        console.log(makeDrumHitArray())
                    }}
                >Save</button>
                
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