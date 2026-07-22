import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import { useState, useContext, createContext, useEffect } from "react";
import { apiRequest } from "../components/Utils";
import { useAuth } from "../components/Context";
import "./Song.css";

function Song() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const { token } = useAuth();

  const fetchSong = async () => {
    try {
      const data = await apiRequest(`/songs/${id}`, null, token, "GET");
      setSong(data);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchSong();
  }, [token, id]);

  return (
    <div className="song">
      <div className="song-left-container">
        <h1> {song?.title} </h1>
        <button
          className="song-left-container-button back"
          onClick={() => navigate("/")}
        >
          Back
        </button>
        <button className="song-left-container-button save">Save</button>
        <button className="song-left-container-button" id="title-change">
          Title
        </button>
        <button className="song-left-container-button" id="automation">
          Automation
        </button>
        <button className="song-left-container-button" id="tempo-change">
          Tempo
        </button>
        <button className="song-left-container-button" id="lyrics-change">
          Lyrics
        </button>
        <button className="song-left-container-button play">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      <div className="song-right-container">
        <div id="song-drums-container">
          <h2
            onClick={() => navigate(`/song/${id}/drum`)}
            style={{ cursor: "pointer" }}
          >
            Drums{" "}
          </h2>
          {/* future buttons/faders/sliders go here, as siblings to the h2 */}
        </div>
        <div id="song-bass-container">
          <h2
            onClick={() => navigate(`/song/${id}/bass`)}
            style={{ cursor: "pointer" }}
          >
            Bass Guitar
          </h2>
          {/* future buttons/faders/sliders go here, as siblings to the h2 */}
        </div>
        <div id="song-rhythm-guitar-container">
          <h2
            onClick={() => navigate(`/song/${id}/rhythm-guitar`)}
            style={{ cursor: "pointer" }}
          >
            {" "}
            Rhythm Guitar{" "}
          </h2>
          {/* future buttons/faders/sliders go here, as siblings to the h2 */}
        </div>
        <div id="song-lead-guitar-container">
          <h2
            onClick={() => navigate(`/song/${id}/lead-guitar`)}
            style={{ cursor: "pointer" }}
          >
            {" "}
            Lead Guitar{" "}
          </h2>
          {/* future buttons/faders/sliders go here, as siblings to the h2 */}
        </div>
      </div>
    </div>
  );
}

export default Song;
