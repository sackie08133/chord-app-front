import "./App.css"
import SongList from "./pages/SongList.jsx"
import Song from "./pages/Song.jsx"
import RhythmGuitar from "./pages/RhythmGuitar.jsx"
import LeadGuitar from "./pages/LeadGuitar.jsx"
import Bass from "./pages/Bass.jsx"
import Drum from "./pages/Drum.jsx"

import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SongList />} />
        <Route path="/song" element={<Song />} />
        <Route path="/song/rhythm-guitar" element={<RhythmGuitar />} />
        <Route path="/song/lead-guitar" element={<LeadGuitar />} />
        <Route path="/song/drum" element={<Drum />} />
        <Route path="/song/bass" element={<Bass />} />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
