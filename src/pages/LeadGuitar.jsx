import { useState, useEffect, useRef } from "react";
import { useAuth } from "../components/Context";
import { useNavigate, useParams } from "react-router-dom";
import "./LeadGuitar.css";
import { playNoteAtTime } from "../components/ChordPlayer";
import { apiRequest, fetchBpm } from "../components/Utils";
import { playGuitarTrack } from "../components/Playback";
import { demoGuitarTracks, demoSongInfo } from "../components/DemoData";
import * as Tone from "tone";

const steps = 32;
const MIN_OCTAVE = 2;
const MAX_OCTAVE = 6;
const chromaticFromC = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

function buildRowList() {
  const rows = [];
  for (let oct = MIN_OCTAVE; oct <= MAX_OCTAVE; oct++) {
    chromaticFromC.forEach((note, rowIndex) => {
      rows.push({ note, octave: oct, rowIndex });
    });
  }
  return rows.reverse();
}

const rowList = buildRowList();

function LeadGuitar() {
  const navigate = useNavigate();
  const [bpm, setBPM] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [trackId, setTrackId] = useState(null);
  const [activeCells, setActiveCells] = useState({});
  const { id } = useParams();
  const isDemo = id === "demo";
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
    if (isDemo) {
      const leadTracks = demoGuitarTracks.filter(
        (t) => t.instrument === "guitar",
      );
      setTracks(leadTracks.map((t) => ({ id: t.id, name: t.name })));
      return;
    }
    try {
      const data = await apiRequest(`/guitar-tracks/${id}`, null, token, "GET");
      setTracks(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchLeadNotes = async (trackId) => {
    if (isDemo) {
      const track = demoGuitarTracks.find((t) => t.id === trackId);
      if (!track) return;
      const loadedCells = {};
      for (const note of track.notes) {
        const row = chromaticFromC.indexOf(note.row);
        const key = `${row}-${note.col}-${note.octave}`;
        loadedCells[key] = true;
      }
      setActiveCells(loadedCells);
      return;
    }
    try {
      const data = await apiRequest(
        `/guitar-tracks/${trackId}/notes`,
        null,
        token,
        "GET",
      );

      const loadedCells = {};
      for (const note of data) {
        const row = chromaticFromC.indexOf(note.row);
        const key = `${row}-${note.col}-${note.octave}`;
        loadedCells[key] = true;
      }
      setActiveCells(loadedCells);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSave = async () => {
    if (isDemo) {
      return alert("Demo songs can't be saved.");
    }
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
    if (isDemo) {
      return alert("Demo tracks can't be deleted.");
    }
    if (!trackId) {
      return alert("No track selected");
    }
    try {
      await apiRequest(`/delete/guitar-tracks`, { trackId }, token);
      alert("Track deleted");
      setTrackId(null);
      fetchLeadTracks(id);
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
          row: chromaticFromC[row],
          col: Number(col),
          octave: Number(oct),
        };
      });
  }

  useEffect(() => {
    fetchLeadTracks(id);
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

        <button
          className="lead-save-button"
          onClick={handleSave}
          disabled={isDemo}
        >
          Save
        </button>

        <select
          id="lead-show-tracks-button"
          onChange={(e) => {
            fetchLeadNotes(e.target.value);
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

      <div className="lead-piano-roll">
        <div className="lead-note-names">
          {rowList.map(({ note, octave }, i) => (
            <div key={i}>
              {note}
              {octave}
            </div>
          ))}
        </div>

        <div className="lead-grid-container">
          {rowList.map(({ note, octave, rowIndex }) =>
            Array.from({ length: steps }).map((_, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}-${octave}`}
                className={`lead-grid-cell ${activeCells[`${rowIndex}-${colIndex}-${octave}`] ? "active" : ""}`}
                onClick={() => {
                  toggleCell(rowIndex, colIndex, octave);
                  playNoteAtTime(note, octave, "poly");
                }}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
}

export default LeadGuitar;
