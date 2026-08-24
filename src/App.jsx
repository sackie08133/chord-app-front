import "./App.css"
import SongList from "./pages/SongList.jsx"
import Song from "./pages/Song.jsx"
import RhythmGuitar from "./pages/RhythmGuitar.jsx"
import LeadGuitar from "./pages/LeadGuitar.jsx"
import Bass from "./pages/Bass.jsx"
import Automation from "./pages/Automation.jsx"
import { AuthProvider } from "./components/Context.jsx"
import Drum from "./pages/Drum.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SongList />} />
          <Route path="/song/:id" element={<Song />} />
          <Route path="/song/:id/rhythm-guitar" element={<RhythmGuitar />} />
          <Route path="/song/:id/lead-guitar" element={<LeadGuitar />} />
          <Route path="/song/:id/drum" element={<Drum />} />
          <Route path="/song/:id/bass" element={<Bass />} />
          <Route path="/song/:id/automation" element = {<Automation />}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
