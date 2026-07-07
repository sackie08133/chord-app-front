import "./SongList.css"
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom"

function SongList() {
  return (
    <div className="song-list">
      <button className="fab">+</button>
      <div className="song-object">
        <div id="song-description-left">
          <h1><Link to="/song">Title</Link></h1>
          <h2>BPM, Last Edited</h2>
        </div>
      </div>
    </div>
  )
}

export default SongList