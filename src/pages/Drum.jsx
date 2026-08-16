import "./Drum.css"
import { useState, useEffect, useRef} from 'react'
import { useAuth } from "../components/Context"
import { useNavigate, useParams } from "react-router-dom"
import { playNoteAtTime } from '../components/ChordPlayer'
import { apiRequest, fetchBpm } from "../components/Utils"
import { drumTypeNames, drumSynthTypes } from "../components/Constants"
import { playDrumTrack } from "../components/Playback"
import * as Tone from "tone"
 
function Drum() {
    const navigate = useNavigate()
    const [activeCells, setActiveCells] = useState({})
    const [tracks, setTracks] = useState([])
    const [bpm, setBPM] = useState([])
    const {id} = useParams()
    const steps = 16
    const {token, setToken} = useAuth()
    const seqRef = useRef(null)
    
    const toggleCell = (row, col) => {
        const key = `${row}-${col}`
        setActiveCells(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
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
    
    function playDrumSound(drumType) {
        playNoteAtTime(null, null, drumSynthTypes[drumType])
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
                    }}>
                    </div>
            )
        })
    }

    useEffect(() => {
        fetchDrumTracks(id)
        const loadBPM = async() => {
            const bpmValue = await fetchBpm(id, token)
            setBPM(bpmValue)
        }
    }, [token, id])


    return (
        <div className='drum-page'>
            <div className='drum-header'>
                <button
                    id="drum-back-button"
                    onClick={() => {
                        navigate(-1)
                    }}> Back </button>

                <button
                    id="drum-play-all-button"
                    onClick={async () => {
                        if (seqRef.current) {
                            seqRef.current.stop()
                            seqRef.current.dispose()
                            seqRef.current = null
                            Tone.Transport.stop()
                        }

                    await Tone.start()
                    const seq = playDrumTrack(makeDrumHitArray(), bpm, 0, false)
                    seqRef.current = seq
                    }}
            >Play All</button>

                <button
                    id="drum-loop-button"
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
                const seq = playDrumTrack(makeDrumHitArray(), bpm, 0, true)
                seqRef.current = seq
                }}
            >{seqRef.current ? "Stop" : "Loop"}</button>


                <button
                    id = "drum-save-button"
                    onClick= {handleSave}
                >Save</button>
                
                <select
                    id="drum-show-tracks-button"
                    onChange={(e) => fetchDrumHits(e.target.value)}
                > Delete
                    {tracks.map((track) => {
                    return (
                        <option className="track-options" key={track.id} value={track.id}>
                            {track.name}
                        </option>
                    );
                    })}
                </select>

                <select
                    id="drum-delete-tracks-button"
                >
                    {tracks.map((track) => {
                    return (
                        <option className="track-options" key={track.id} value={track.id}>
                            {track.name}
                        </option>
                    );
                    })}
                </select>
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