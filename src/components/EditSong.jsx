import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, useEffect } from "react";
import { apiRequest } from "./Utils.jsx";
import { useAuth } from "./Context.jsx";
import "./Modal.css";
import "./EditSong.css";

// edit song title and bpm on a modal
function EditSong({onClose, songId, onSongEdited }) {
  const [title, setTitle] = useState("");
  const [bpm, setBPM] = useState("");
  const {token,setToken} = useAuth()

  const handleEditSong = async () => {
      try {
        await apiRequest(`/songs/${songId}`, 
          {
              title: title,
              bpm: bpm,
          }, token, "PUT")
        onClose(),
        songId,
        onSongEdited
      } catch(error) {
          alert(error.message)
      }
    }

  return (
    <Dialog open={true} onClose={onClose} className="modal-backdrop">
      <div className="modal-create-song-container">
        <DialogPanel>
          <DialogTitle>Edit Song</DialogTitle>
          <p>Set Title, and BPM for your song</p>
          <button className="modal-close-button" onClick={onClose}>
            X
          </button>
          <div className="song-modal">
            <input
              type="text"
              className="modal-element"
              placeholder="Title?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="number"
              pattern="[0-9]"
              className="modal-element"
              placeholder="BPM?"
              value={bpm}
              onChange={(e) => setBPM(e.target.value)}
            />
            <button className="modal-edit-song-button" onClick={handleEditSong}>
              Edit Song
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default EditSong;
