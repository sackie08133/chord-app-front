import { useParams, Link, Outlet } from "react-router-dom";
import './Song.css'

function Song() {

    return (
        <div className="song">
            <div className="left-container">
                <button className="left-container-button back">Back</button>
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
                <div id="drums-container"></div>
                <div id="bass-container"></div>
                <div id="rhythm-guitar-container"></div>
                <div id="lead-guitar-container"></div>
            </div>
            
        </div>
    )
}

export default Song;