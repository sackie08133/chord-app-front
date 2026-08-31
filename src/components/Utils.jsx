import { StringsStandard } from "./Constants";
import { Notes } from "./Constants";
import { API_URL } from "./Constants";

// get the octave of a note given index of string and the fret num
export function getOctave(stringIndex, fretNumber) {
  if (fretNumber === null) {
    return null;
  }

  let stringOctave = StringsStandard[stringIndex].octave;
  let newOctave = stringOctave + Math.floor(fretNumber / 12);
  return newOctave;
}

// get a song's bpm based on the ID, with authentication test
export const fetchBpm = async (id, token) => {
    try {
        const data = await apiRequest(`/songs/${id}`, null, token, "GET")
        return data.bpm
    } catch (error) {
        alert(error.message)
    }
}

// take movable chord basic, move all notes in that chord to fit the root note (ie, move E shape up 2 frets to make G in CAGED)
export function shiftVoicing(voicing, rootFret) {
  return voicing.map((offset) => {
    if (offset === null) {
      return null;
    }
    return offset + rootFret;
  });
}

// recieves a letter, returns the chromatic scale number
export function getNoteNumber(noteLetter) {
  return Notes.findIndex((notePair) => notePair.includes(noteLetter));
}

// get a name based on a number, chromatic scale
export function getNoteName(chromaticNum, key, sharpOrFlat) {
  const keyNumber = getNoteNumber(key)
  if (keyNumber === -1) return null

  const actualIndex = ((chromaticNum + keyNumber) % 12 + 12) % 12;
  return Notes[actualIndex][sharpOrFlat]
}

// backend API call 
export async function apiRequest(path, body, token, method = "POST") {
  const headers = { "Content-Type": "application/json" }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const options = {
    method,
    headers,
    cache: "no-store",
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(`${API_URL}${path}`, options);
  if (response.status === 401 || response.status === 403) {
    throw new Error("Authentication required")
  }
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong")
  }
  return data;
}


// fetch drum tracks API call
export async function fetchDrumTracksFor(songId, token) {
    return await apiRequest(`/drum-tracks/${songId}`, null, token, "GET")
}

// fetch guitar tracks API call
export async function fetchGuitarTracksFor(songId, token) {
    return await apiRequest(`/guitar-tracks/${songId}`, null, token, "GET")
}

// fetch rhythm tracks API call
export async function fetchRhythmTracksFor(songId, token) {
    return await apiRequest(`/rhythm-guitar/${songId}`, null, token, "GET")
}

// fetch drum hits API call
export async function fetchDrumHitsFor(trackId, token) {
    return await apiRequest(`/drum-tracks/${trackId}/hits`, null, token, "GET")
}

// fetch guitar notes API call
export async function fetchGuitarNotesFor(trackId, token) {
    return await apiRequest(`/guitar-tracks/${trackId}/notes`, null, token, "GET")
}