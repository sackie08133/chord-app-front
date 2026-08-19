import playChord from "../components/ChordPlayer";
import Fretboard from "../components/Fretboard";
import { scales, noteNamesSharps, noteNamesFlats } from "../components/Constants"
import { basic } from "../components/ChordShapes";
import { shiftVoicing } from "../components/Utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/Context";
import { useParams } from "react-router-dom";
import "./RhythmGuitar.css";

function RhythmGuitar() {
  const navigate = useNavigate();
  const { token, setToken } = useAuth();

  return (
    <div className="Rhythm-Guitar">
      <div className="rhythm-guitar-header">
        <button className="rhythm-guitar-back" onClick={() => navigate(-1)}>
          Back
        </button>
        <button className="rhythm-guitar-save">Save</button>
        <button className="rhythm-guitar-about">About</button>

        <select id="scale-dropdown">
          <option>C</option>
          <option>C#/Db</option>
          <option>D</option>
          <option>D#/Eb</option>
          <option>E</option>
          <option>F</option>
          <option>F#/Gb</option>
          <option>G</option>
          <option>G#/Ab</option>
          <option>A</option>
          <option>A#/Bb</option>
          <option>B</option>
        </select>

        <select id="chord-voicing">
          <option>C shape</option>
          <option>A shape</option>
          <option>G shape</option>
          <option>E shape</option>
          <option>D shape</option>
  
        </select>
      </div>

      <div className="rhythm-guitar-fretboard">
        <Fretboard />
      </div>

      <div className="rhythm-guitar-chord-list">
        <div className="rhythm-guitar-chord">
          <div className="rhythm-guitar-chord-header">
            <button className="rhythm-guitar-chord-about">?</button>
            <button className="rhythm-guitar-chord-lock">Lock</button>
          </div>
          C
        </div>

        <div className="rhythm-guitar-chord">
          <div className="rhythm-guitar-chord-header">
            <button className="rhythm-guitar-chord-about">?</button>
            <button className="rhythm-guitar-chord-lock">Lock</button>
          </div>
          G
        </div>

        <div className="rhythm-guitar-chord">
          <div className="rhythm-guitar-chord-header">
            <button className="rhythm-guitar-chord-about">?</button>
            <button className="rhythm-guitar-chord-lock">Lock</button>
          </div>
          F
        </div>

        <div className="rhythm-guitar-chord">
          <div className="rhythm-guitar-chord-header">
            <button className="rhythm-guitar-chord-about">?</button>
            <button className="rhythm-guitar-chord-lock">Lock</button>
          </div>
          A
        </div>
      </div>

      <div className="rhythm-guitar-footer">
        <div className="rhythm-guitar-strumming-pattern">Strumming Pattern</div>
        <div className="rhythm-guitar-volume-panning-fader">Volume and Panning</div>
      </div>
    </div>
  );
}

export default RhythmGuitar;
