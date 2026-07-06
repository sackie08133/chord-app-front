
import "./SongList.css" 

function SongList() { 
    return (
       <div className = "song-list">
            <button className="fab">+</button>
            <div className = "song-object">
                <div id = "song-description-left">
                    <h1>Title</h1>
                    <h2>BPM, Last Edited</h2>
                </div>
                
                    
             
            </div>
       </div> 
    )
}

export default SongList