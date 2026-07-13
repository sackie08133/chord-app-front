import "./SongList.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginSignup from "../components/LoginSignup";
import NewSong from "../components/NewSong"

function SongList() {
  const [showLogin, setShowLogin] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [token, setToken] = useState(null)

  return (
    <div className="song-list">
      {showLogin && (
        <LoginSignup 
        onClose={() => setShowLogin(false)} 
        onLoginSuccess={(token) => setToken(token)}
      />)}
      {showCreate && <NewSong onClose ={() => setShowCreate(false)}/>}

      <div className="header">
        <button
          className="login-signup"
          id="login"
          onClick={() => setShowLogin(true)}
        > Login / Sign Up </button>
      </div>
      

      <button 
        className="fab" 
        onClick = {() => setShowCreate(true) }
        >+</button>
     
      <div className="song-object">
        <div id="song-description-left">
          <h1>
            <Link to="/song">Title</Link>
          </h1>
          <h2>BPM, Last Edited</h2>
        </div>
      </div>

      
    </div>
  );
}

export default SongList;
