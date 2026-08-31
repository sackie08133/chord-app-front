import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, useEffect } from "react";
import { apiRequest } from "./Utils.jsx";
import "./Modal.css";
import "./NewSong.css";

function NewSong({ onClose, token, onSongCreated }) {
  const [title, setTitle] = useState("");
  const [bpm, setBPM] = useState("");

  const handleMakeSong = async () => {
    try {
      await apiRequest(
        "/create",
        {
          title: title,
          bpm: bpm,
        },
        token,
      )
      onSongCreated
      onClose()
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="modal-backdrop">
      <div className="modal-create-song-container">
        <DialogPanel>
          <DialogTitle>Create Song</DialogTitle>
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
            <button className="modal-create-song-button" onClick={handleMakeSong}>
              Create Song
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default NewSong;
