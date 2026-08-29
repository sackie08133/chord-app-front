import { useState, useEffect, useRef } from "react";
import { useAuth } from "../components/Context";
import { useNavigate, useParams } from "react-router-dom";
import "./LeadGuitar.css";
import { noteNamesSharps, noteNamesFlats } from "../components/Constants";
import { playNoteAtTime } from "../components/ChordPlayer";
import { apiRequest, fetchBpm } from "../components/Utils";
import { playGuitarTrack } from "../components/Playback";
import * as Tone from "tone";

const steps = 32;

function LeadGuitar() {
  const [octave, setOctave] = useState(1);
  const navigate = useNavigate();
  const [bpm, setBPM] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [trackId, setTrackId] = useState(null);
  const [activeCells, setActiveCells] = useState({});
  const bIndex = noteNamesSharps.indexOf("B");
  const { id } = useParams();
  const { token, setToken } = useAuth();
  const seqRef = useRef(null);

  const toggleCell = (row, col, oct) => {
    const key = `${row}-${col}-${oct}`;
    setActiveCells((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const fetchLeadTracks = async (songId) => {
    try {
      const data = await apiRequest(`/guitar-tracks/${id}`, null, token, "GET");
      setTracks(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchLeadNotes = async (trackId) => {
    try {
      const data = await apiRequest(
        `/guitar-tracks/${trackId}/notes`,
        null,
        token,
        "GET",
      );

      const loadedCells = {};
      for (const note of data) {
        const row = noteNamesSharps.indexOf(note.row);
        const key = `${row}-${note.col}-${note.octave}`;
        loadedCells[key] = true;
      }
      setActiveCells(loadedCells);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSave = async () => {
    const trackTitle = prompt("Lead Guitar Track Title?", "Track");
    const guitarNotesArray = makeGuitarNotesArray();

    if (!id || !trackTitle || guitarNotesArray.length === 0) {
      return alert("Song id, track title, or guitar notes failed to save");
    }

    try {
      const data = await apiRequest(
        "/guitar-tracks",
        {
          song_id: id,
          track_name: trackTitle,
          guitar_notes: guitarNotesArray,
          instrument: "guitar",
        },
        token,
      );
      await fetchLeadTracks(id);
      
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (!trackId) {
      return alert("No track selected");
    }
    try {
      const statement = await apiRequest(
        `/delete/guitar-tracks`,
        { trackId },
        token,
      );
    } catch (error) {
      alert(error.message);
    }
  };

  function makeGuitarNotesArray() {
    return Object.keys(activeCells)
      .filter((key) => activeCells[key])
      .map((key) => {
        const [row, col, oct] = key.split("-");
        return {
          row: noteNamesSharps[row],
          col: Number(col),
          octave: Number(oct),
        };
      });
  }

  useEffect(() => {
    fetchLeadTracks(id);
    const loadBPM = async () => {
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
    <div className="lead-page">
      <div className="lead-header">
        <button className="lead-back-button" onClick={() => navigate(-1)}>
          Back
        </button>

        <button
          id="lead-play-all-button"
          disabled={!bpm}
          onClick={async () => {
            if (seqRef.current) {
              seqRef.current.stop();
              seqRef.current.dispose();
              seqRef.current = null;
              Tone.Transport.stop();
            }

            await Tone.start();
            const seq = playGuitarTrack(
              makeGuitarNotesArray(),
              bpm,
              0,
              false,
              "guitar",
            );
            seqRef.current = seq;
          }}
        >
          Play All
        </button>

        <button
          id="lead-loop-button"
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
            const seq = playGuitarTrack(
              makeGuitarNotesArray(),
              bpm,
              0,
              true,
              "guitar",
            );
            seqRef.current = seq;
          }}
        >
          {seqRef.current ? "Stop" : "Loop"}
        </button>

        <div className="lead-fader-group">
          <label>Volume</label>
          <input type="range" min="0" max="100" />
          <label>Pan</label>
          <input type="range" min="-100" max="100" />
        </div>
        <button
          className="lead-octave-button"
          onClick={() => setOctave(octave - 1)}
        >
          Octave -
        </button>
        <button
          className="lead-octave-button"
          onClick={() => setOctave(octave + 1)}
        >
          Octave +
        </button>
        <button className="lead-save-button" onClick={handleSave}>
          Save
        </button>

        <select
          id="lead-show-tracks-button"
          onChange={(e) => fetchLeadNotes(e.target.value)}
        >
          {tracks.map((track) => {
            return (
              <option className="track-options" key={track.id} value={track.id}>
                {track.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className="lead-piano-roll">
        <div className="lead-note-names">
          {noteNamesSharps.map((note, rowIndex) => (
            <div key={note}>
              {note}
              {rowIndex < bIndex ? octave + 1 : octave}
            </div>
          ))}
        </div>

        <div className="lead-grid-container">
          {noteNamesSharps.map((note, rowIndex) => {
            const rowOctave = rowIndex < bIndex ? octave + 1 : octave;
            return Array.from({ length: steps }).map((_, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}-${rowOctave}`}
                className={`lead-grid-cell ${activeCells[`${rowIndex}-${colIndex}-${rowOctave}`] ? "active" : ""}`}
                onClick={() => {
                  toggleCell(rowIndex, colIndex, rowOctave);
                  playNoteAtTime(note, rowOctave, "poly");
                }}
              />
            ));
          })}
        </div>
      </div>
    </div>
  );
}

export default LeadGuitar;
