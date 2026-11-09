import "./SongList.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
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

  const fetchSongs = useCallback(async () => {
    try {
      const data = await apiRequest("/songs", null, token, "GET");
      setSongs(data);
    } catch (error) {
      console.error(error.message);
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSongs();
  }, [fetchSongs]);

  // Demo song always shows first, regardless of login state
  const allSongs = [demoSongInfo, ...songs];

  return (
    <div className="song-list">
      {showLogin && (
        <LoginSignup
          onClose={() => setShowLogin(false)}
          onLoginSuccess={(token) => setToken(token)}
        />
      )}
      {showCreate && (
        <NewSong
          onClose={() => setShowCreate(false)}
          token={token}
          onSongCreated={fetchSongs}
        />
      )}

      <header className="song-list-header">
        <span className="song-list-brand">Mr. Savoy’s Rockwriter</span>
        <button
          className="song-list-login-signup"
          id="login"
          onClick={() => (token ? handleLogout() : setShowLogin(true))}
        >
          {token ? "Logout" : "Login / Sign Up"}{" "}
        </button>
      </header>

      <main className="song-list-content">
        <div className="song-list-intro">
          <div>
            <h1>Songs</h1>
            <p>Pick a song and try making a beat.</p>
          </div>
          <button className="song-list-new" onClick={() => setShowCreate(true)}>
            + New Song
          </button>
        </div>

        {allSongs.map((song) => (
          <article className="song-list-song-object" key={song.id}>
            <div>
              <h2><Link to={`/song/${song.id}`}>{song.title}</Link></h2>
              <p>
                {song.bpm} BPM
                {song.last_edited ? ` · ${song.last_edited.split("T")[0]}` : ""}
              </p>
            </div>
            {song.id !== "demo" && (
              <button
                onClick={() => handleDeleteSong(song.id)}
                className="song-list-delete-song-button"
              >
                Delete Song
              </button>
            )}
          </article>
        ))}
      </main>
    </div>
  );
}

export default SongList;
