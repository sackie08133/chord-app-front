import "./Drum.css"
import { useState, useEffect} from 'react'
import { useAuth } from "../components/Context"
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import { playNote } from '../components/ChordPlayer'
import { apiRequest } from "../components/Utils"

function Drum() {
    const navigate = useNavigate()
    const [activeCells, setActiveCells] = useState({})
    const [tracks, setTracks] = useState([])
    const {id} = useParams()
    const steps = 16;
    const drumSynthTypes = ['membrane', 'snare', 'hihat'] // membrane === kick
    const drumTypeNames = ['kick', 'snare', 'hihat']
    const { token, setToken } = useAuth();
    
    
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

    const handleSave = async() => {
        const trackTitle = prompt("Drum Track Title?", "Track")
        const drumHitArray = makeDrumHitArray()

        if (!id || !trackTitle || drumHitArray.length === 0) {
            return alert("Song id, track title, or drum hits failed to save")
        }

        try {
            const data = await apiRequest('/drum-tracks', {
                song_id: id,
                track_name: trackTitle,
                drum_hits: drumHitArray
            }, token)
        } catch (error) {
            alert(error.message)
        }
    }

    const fetchDrumTracks = async(songId) => {
        try {
            const data = await apiRequest(`/drum-tracks/${id}`, null, token, "GET")   
            setTracks(data)
        } catch (error) {
            alert(error.message)
        }
    }

    const fetchDrumHits = async (trackId) => {
        try {
            const data = await apiRequest(
                `/drum-tracks/${trackId}/hits`, null, token, "GET")

        const loadedCells = {}
        for (const hit of data) {
            const row = drumTypeNames.indexOf(hit.drum_type)
            if (row !== -1) {
                const key = `${row}-${hit.col}`
                loadedCells[key] = true
            }
        }

setActiveCells(loadedCells)
        } catch (error) {
            alert(error.message)
        }
    }

    useEffect(() => {
        fetchDrumTracks()
    }, [token])
    

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
                    onClick= {handleSave}
                >Save</button>
                
                <select
                    id="drum-show-tracks-button"
                    onChange={(e) => fetchDrumHits(e.target.value)}
                >
                    {tracks.map((track) => {
                    return (
                        <option className="track-options" key={track.id} value={track.id}>
                            {track.name}
                        </option>
                    );
                    })}
                </select>

                <button
                    className = "drum-track-delete-button"
                    onClick = {() => {
                        console.log("Delete")
                    }}
                >Delete</button>
                
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