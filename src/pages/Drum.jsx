import "./Drum.css";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../components/Context";
import { useNavigate, useParams } from "react-router-dom";
import { playNoteAtTime } from "../components/ChordPlayer";
import { apiRequest, fetchBpm } from "../components/Utils";
import { drumTypeNames, drumSynthTypes } from "../components/Constants";
import { playDrumTrack } from "../components/Playback";
import { demoDrumTracks, demoSongInfo } from "../components/DemoData";
import * as Tone from "tone";

function Drum() {
  const navigate = useNavigate();
  const [activeCells, setActiveCells] = useState({});
  const [tracks, setTracks] = useState([]);
  const [trackId, setTrackId] = useState(null);
  const [bpm, setBPM] = useState(null);
  const { id } = useParams();
  const isDemo = id === "demo";
  const steps = 32;
  const { token, setToken } = useAuth();
  const seqRef = useRef(null);

  const toggleCell = (row, col) => {
    const key = `${row}-${col}`;
    setActiveCells((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const fetchDrumTracks = async (songId) => {
    if (isDemo) {
      setTracks(demoDrumTracks.map((t) => ({ id: t.id, name: t.name })));
      return;
    }
    try {
      const data = await apiRequest(`/drum-tracks/${id}`, null, token, "GET");
      setTracks(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSave = async () => {
    if (isDemo) {
      return alert("Demo songs can't be saved.");
    }
    const trackTitle = prompt("Drum Track Title?", "Track");
    const drumHitArray = makeDrumHitArray();

    if (!id || !trackTitle || drumHitArray.length === 0) {
      return alert("Song id, track title, or drum hits failed to save");
    }

    try {
      const data = await apiRequest(
        "/drum-tracks",
        {
          song_id: id,
          track_name: trackTitle,
          drum_hits: drumHitArray,
        },
        token,
      );

      await fetchDrumTracks(id);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (isDemo) {
      return alert("Demo tracks can't be deleted.");
    }
    if (!trackId) {
      return alert("No track selected");
    }
    try {
      await apiRequest(`/delete/drum-tracks`, { trackId }, token);
      alert("Track deleted");
      setTrackId(null);
      fetchDrumTracks(id);
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchDrumHits = async (trackId) => {
    if (isDemo) {
      const track = demoDrumTracks.find((t) => t.id === trackId);
      if (!track) return;
      const loadedCells = {};
      for (const hit of track.hits) {
        const row = drumTypeNames.indexOf(hit.drum_type);
        if (row !== -1) {
          const key = `${row}-${hit.col}`;
          loadedCells[key] = true;
        }
      }
      setActiveCells(loadedCells);
      return;
    }
    try {
      const data = await apiRequest(
        `/drum-tracks/${trackId}/hits`,
        null,
        token,
        "GET",
      );

      const loadedCells = {};
      for (const hit of data) {
        const row = drumTypeNames.indexOf(hit.drum_type);
        if (row !== -1) {
          const key = `${row}-${hit.col}`;
          loadedCells[key] = true;
        }
      }
      setActiveCells(loadedCells);
    } catch (error) {
      alert(error.message);
    }
  };

  function playDrumSound(drumType) {
    playNoteAtTime(null, null, drumSynthTypes[drumType]);
  }

  function makeDrumHitArray() {
    return Object.keys(activeCells)
      .filter((key) => activeCells[key])
      .map((key) => {
        const [row, col] = key.split("-");
        return {
          drum_type: drumTypeNames[row],
          col: Number(col),
        };
      });
  }

  function makeDivArray(rowIndex) {
    return Array.from({ length: steps }).map((_, colIndex) => {
      const key = `${rowIndex}-${colIndex}`;
      const wasActive = activeCells[key];
      return (
        <div
          className={`drum-shot ${activeCells[key] ? "active" : ""}`}
          key={key}
          onClick={() => {
            toggleCell(rowIndex, colIndex);
            if (!wasActive) {
              playDrumSound(rowIndex);
            }
          }}
        ></div>
      );
    });
  }

  useEffect(() => {
    fetchDrumTracks(id);
    const loadBPM = async () => {
      if (isDemo) {
        setBPM(demoSongInfo.bpm);
        return;
      }
      const bpmValue = await fetchBpm(id, token);
      setBPM(bpmValue);
    };
    loadBPM();
  }, [token, id]);

  useEffect(() => {
    return () => {
      if (seqRef.current) {
        seqRef.current.stop();
        seqRef.current.dispose();
        seqRef.current = null;
      }
      Tone.Transport.stop();
      Tone.Transport.cancel();
    };
  }, []);

  return (
    <div className="drum-page">
      <div className="drum-header">
        <button
          id="drum-back-button"
          onClick={() => {
            navigate(-1);
          }}
        >
          {" "}
          Back{" "}
        </button>

        <button
          id="drum-play-all-button"
          disabled={!bpm}
          onClick={async () => {
            if (seqRef.current) {
              seqRef.current.stop();
              seqRef.current.dispose();
              seqRef.current = null;
              Tone.Transport.stop();
            }

            await Tone.start();
            const seq = playDrumTrack(makeDrumHitArray(), bpm, 0, false);
            seqRef.current = seq;
          }}
        >
          Play All
        </button>

        <button
          id="drum-loop-button"
          disabled={!bpm}
          onClick={async () => {
            if (seqRef.current) {
              seqRef.current.stop();
              seqRef.current.dispose();
              seqRef.current = null;
              Tone.Transport.stop();
              return;
            }

            await Tone.start();
            const seq = playDrumTrack(makeDrumHitArray(), bpm, 0, true);
            seqRef.current = seq;
          }}
        >
          {seqRef.current ? "Stop" : "Loop"}
        </button>

        <button id="drum-save-button" onClick={handleSave} disabled={isDemo}>
          Save
        </button>

        <select
          id="drum-show-tracks-button"
          onChange={(e) => {
            fetchDrumHits(isDemo ? e.target.value : e.target.value);
            setTrackId(e.target.value);
          }}
        >
          <option value="">Select Track</option>
          {tracks.map((track) => {
            return (
              <option className="track-options" key={track.id} value={track.id}>
                {track.name}
              </option>
            );
          })}
        </select>

        {!isDemo && (
          <button className="rhythm-guitar-delete" onClick={handleDelete}>
            Delete Currently Selected Track
          </button>
        )}
      </div>

      <div className="drum-sequencer">
        <div className="drum-type" id="kick">
          {makeDivArray(0)}
        </div>
        <div className="drum-type" id="snare">
          {makeDivArray(1)}
        </div>
        <div className="drum-type" id="hi-hat">
          {makeDivArray(2)}
        </div>
      </div>
    </div>
  );
}

export default Drum;
