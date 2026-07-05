
import "./SongList.css" 

function SongList() { 
    return (
       <div className = "song-list">
            <div className = "song-object">
                <div id = "song-description">
                    <h1>Title</h1>
                    <h2>BPM, Last Edited</h2>
                </div>
                
                <button>Go</button>
            </div>
       </div> 
    )
}

export default SongList