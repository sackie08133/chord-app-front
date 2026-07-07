


import playChord from '../components/ChordPlayer';
import Fretboard from '../components/Fretboard';
import { basic } from '../components/ChordShapes';
import { shiftVoicing } from '../components/utils';
import { useNavigate } from 'react-router-dom';
import "./RhythmGuitar.css"


function RhythmGuitar() {
  const navigate = useNavigate();

  return (
    <div className="Rhythm-Guitar">
      <div className="Header">
        <button className="back" onClick={() => navigate('/song')}>Back</button>
        <button className="save">Save</button>
        <button className="about">About</button>

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

      <div className="fretboard">
        <Fretboard />
      </div>

      <div className="chord-list">
        <div className="chord">
          <div class="chord-header">
            <button class="chord-about">?</button>
            <button class="chord-lock">Lock</button>
          </div>
          C
        </div>

        <div className="chord">
          <div class="chord-header">
            <button class="chord-about">?</button>
            <button class="chord-lock">Lock</button>
          </div>
          G
        </div>

        <div className="chord">
          <div class="chord-header">
            <button class="chord-about">?</button>
            <button class="chord-lock">Lock</button>
          </div>
          F
        </div>

        <div className="chord">
          <div class="chord-header">
            <button class="chord-about">?</button>
            <button class="chord-lock">Lock</button>
          </div>
          A
        </div>
      </div>

      <div className="footer">
        <div className="strumming-pattern">Strumming Pattern</div>
        <div className="volume-panning-fader">Volume and Panning</div>
      </div>
    </div>
  );
}

export default RhythmGuitar
