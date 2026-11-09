import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { apiRequest } from "./Utils.jsx";
import "./Modal.css";
import "./NewSong.css";

function NewSong({ onClose, token, onSongCreated }) {
  const [title, setTitle] = useState("");
  const [bpm, setBPM] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleMakeSong = async (event) => {
    event.preventDefault();
    if (saving || !title.trim()) return;

    setSaving(true);
    setError("");
    try {
      await apiRequest("/create", { title: title.trim(), bpm: Number(bpm) }, token);
      await onSongCreated?.();
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="modal-backdrop">
      <DialogPanel className="new-song-panel">
        <DialogTitle className="new-song-title">Create a song</DialogTitle>
        <p>Give your song a name and pick how fast it should go.</p>

        <form className="new-song-form" onSubmit={handleMakeSong}>
          <label>
            Song name
            <input
              data-autofocus
              type="text"
              placeholder="My first beat"
              value={title}
              required
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <label>
            Tempo (beats per minute)
            <input
              type="number"
              min="1"
              placeholder="120"
              value={bpm}
              required
              onChange={(event) => setBPM(event.target.value)}
            />
          </label>
          {error && <p className="new-song-error" role="alert">{error}</p>}
          <div className="new-song-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={saving || !title.trim()}>
              {saving ? "Creating…" : "Create Song"}
            </button>
          </div>
        </form>
      </DialogPanel>
    </Dialog>
  );
}

export default NewSong;
