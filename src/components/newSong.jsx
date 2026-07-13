import {Dialog, DialogPanel, DialogTitle} from '@headlessui/react'
import {useState} from 'react'
import { apiRequest } from './utils.jsx'
import './Modal.css'
import './NewSong.css'

function NewSong({onClose, token}) {
    const [title, setTitle] = useState('')
    const [bpm, setBPM] = useState('')
    
    const handleMakeSong = async () => {
        try {
            await apiRequest('/create', {
                title: title,
                bpm: bpm,
            }, token)
            onClose()
        } catch (error) {
            alert(error.message)
        }
    }

    return (
        <Dialog open={true} onClose={onClose} className="modal-backdrop">
            <div className="create-song-container">
                <DialogPanel>
                    <DialogTitle>Create Song</DialogTitle>
                    <p>Set Title, and BPM for your song</p>
                    <button className="close-button" onClick={onClose}>X</button>
                    <div className="song-modal">
                        <input
                            type="text"
                            className="element"
                            placeholder="Title?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            type="number"
                            pattern="[0-9]"
                            className="element"
                            placeholder="BPM?"
                            value={bpm}
                            onChange={(e) => setBPM(e.target.value)}
                        />      
                        <button className="create-song-button" onClick={handleMakeSong}>Create Song</button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}

export default NewSong