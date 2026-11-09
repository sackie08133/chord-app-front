import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../components/Utils";
import { useAuth } from "../components/Context";
import "./Song.css";
import EditSong from "../components/EditSong";
import { demoSongInfo } from "../components/DemoData";

function Song() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const { token } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const isDemo = id === "demo";

  const fetchSong = useCallback(async () => {
    if (isDemo) {
      setSong(demoSongInfo);
      return;
    }
    try {
      const data = await apiRequest(`/songs/${id}`, null, token, "GET");
      setSong(data);
    } catch (error) {
      alert(error.message);
    }
  }, [id, isDemo, token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSong();
  }, [fetchSong]);

  return (
    <div className="song">
      {showEdit && !isDemo && (
        <EditSong
          onClose={() => setShowEdit(false)}
          songId={id}
          onSongEdited={fetchSong}
        />
      )}

      <div className="song-left-container">
        <h1> {song?.title} </h1>
        <button
          className="song-left-container-button back"
          onClick={() => navigate("/")}
        >
          Back
        </button>
        {!isDemo && (
          <button
            className="song-left-container-button"
            id="edit-song"
            onClick={() => {
              setShowEdit(true);
            }}
          >
            Edit Song
          </button>
        )}
        <button
          className="song-left-container-button"
          id="automation"
          onClick={() => navigate(`/song/${id}/automation`)}
        >
          Put Your Song Together
        </button>
      </div>

      <section className="song-instruments" aria-label="Instruments">
        <p>Choose an instrument to start playing.</p>
        <Link className="song-instrument drums" to={`/song/${id}/drum`}>Drums</Link>
        <Link className="song-instrument bass" to={`/song/${id}/bass`}>Bass Guitar</Link>
        <Link className="song-instrument rhythm" to={`/song/${id}/rhythm-guitar`}>Rhythm Guitar</Link>
        <Link className="song-instrument lead" to={`/song/${id}/lead-guitar`}>Lead Guitar</Link>
      </section>
    </div>
  );
}

export default Song;
