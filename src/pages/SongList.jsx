import "./SongList.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginSignup from "../components/LoginSignup";

function SongList() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="song-list">
      <div className="header">
        <button
          className="login-signup"
          id="login"
          onClick={() => setShowLogin(true)}
        >
          Login / Sign Up
        </button>
      </div>
      {showLogin && <LoginSignup onClose={() => setShowLogin(false)} />}

      <button className="fab">+</button>
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
