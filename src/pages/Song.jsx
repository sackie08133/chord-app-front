import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import './Song.css'

function Song() {
    const navigate = useNavigate()

    return (
        <div className="song">
            <div className="left-container">
                <button className="left-container-button back" onClick={() => navigate('/')}>Back</button>
                <button className="left-container-button save">Save</button>
                <button className="left-container-button" id="title-change">Title</button>
                <button className="left-container-button" id="automation">Automation</button>
                <button className="left-container-button" id="tempo-change">Tempo</button>
                <button className="left-container-button" id="lyrics-change">Lyrics</button>
                <button className="left-container-button play">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </button>
            </div>

            <div className = "right-container">
                <div id="drums-container">
                    <h2 
                    onClick={() => navigate('/song/drum')}
                    style={{ cursor: 'pointer' }}
                   >Drums </h2>
                   {/* future buttons/faders/sliders go here, as siblings to the h2 */}
                </div>
                <div id="bass-container">
                    <h2 
                    onClick={() => navigate('/song/bass')}
                    style={{ cursor: 'pointer' }}
                    >Bass Guitar</h2>
                    {/* future buttons/faders/sliders go here, as siblings to the h2 */}
                </div>
                <div id="rhythm-guitar-container">
                   <h2 
                    onClick={() => navigate('/song/rhythm-guitar')}
                    style={{ cursor: 'pointer' }}
                   > Rhythm Guitar </h2>
                   {/* future buttons/faders/sliders go here, as siblings to the h2 */}
                </div>
                <div id="lead-guitar-container">
                    <h2 
                    onClick={() => navigate('/song/lead-guitar')}
                    style={{ cursor: 'pointer' }}
                   > Lead Guitar </h2>
                   {/* future buttons/faders/sliders go here, as siblings to the h2 */}
                </div>
            </div>
        </div>
    )
}

export default Song;