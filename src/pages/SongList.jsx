import "./SongList.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginSignup from "../components/LoginSignup";
import NewSong from "../components/NewSong";
import { useAuth } from "../components/Context";
import { apiRequest } from "../components/Utils";
import { demoSongInfo } from "../components/DemoData";

function SongList() {
  const [showLogin, setShowLogin] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const { token, setToken } = useAuth();
  const [songs, setSongs] = useState([]);

  const fetchSongs = async () => {
    try {
      const data = await apiRequest("/songs", null, token, "GET");
      setSongs(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleLogout = () => {
    setToken(null);
    fetchSongs();
  };

  const handleDeleteSong = async (songId) => {
    try {
      await apiRequest("/delete", { id: songId }, token);
      fetchSongs();
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [token, songs]);

  // Demo song always shows first, regardless of login state
  const allSongs = [demoSongInfo, ...songs];

  return (
    <div className="song-list">
      <span className="song-list-ai-disclosure">AI used for styling page and learning</span>
      {showLogin && (
        <LoginSignup
          onClose={() => setShowLogin(false)}
          onLoginSuccess={(token) => setToken(token)}
        />
      )}
      {showCreate && (
        <NewSong onClose={() => setShowCreate(false)} token={token} />
      )}

      <div className="song-list-header">
        <button
          className="song-list-login-signup"
          id="login"
          onClick={() => (token ? handleLogout() : setShowLogin(true))}
        >
          {token ? "Logout" : "Login / Sign Up"}{" "}
        </button>
      </div>

      <button className="song-list-fab" onClick={() => setShowCreate(true)}>
        +
      </button>

      {allSongs.map((song) => (
        <div className="song-list-song-object" key={song.id}>
          <div id="song-list-song-description-left">
            <h1>
              {" "}
              <Link to={`/song/${song.id}`}>{song.title}</Link>{" "}
            </h1>
            <h2>
              {" "}
              {song.bpm} BPM
              {song.last_edited ? `, ${song.last_edited.split("T")[0]}` : ""}
            </h2>
            {song.id !== "demo" && (
              <button
                onClick={() => handleDeleteSong(song.id)}
                className="song-list-delete-song-button"
              >
                Delete Song
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SongList;
