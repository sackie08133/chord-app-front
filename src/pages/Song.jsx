import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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

  const fetchSong = async () => {
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
  };

  useEffect(() => {
    fetchSong();
  }, [token, id]);

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
          Automation
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
        </div>
        <div id="song-bass-container">
          <h2
            onClick={() => navigate(`/song/${id}/bass`)}
            style={{ cursor: "pointer" }}
          >
            Bass Guitar
          </h2>
        </div>
        <div id="song-rhythm-guitar-container">
          <h2
            onClick={() => navigate(`/song/${id}/rhythm-guitar`)}
            style={{ cursor: "pointer" }}
          >
            {" "}
            Rhythm Guitar{" "}
          </h2>
        </div>
        <div id="song-lead-guitar-container">
          <h2
            onClick={() => navigate(`/song/${id}/lead-guitar`)}
            style={{ cursor: "pointer" }}
          >
            {" "}
            Lead Guitar{" "}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Song;
