#  Rockwriter

A web-based songwriting host, inspired by a Chrome Music Lab assignment I had back in elementary school. (Thank you, Mr. Savoy!)

**No installation needed** — just visit the live app:
 **[rockwriter-bwm3r5cq3-sackie08133.vercel.app](https://rockwriter-bwm3r5cq3-sackie08133.vercel.app/)**

## 🛠️ Tech Stack

- React
- JavaScript
- CSS / HTML
- PostgreSQL
- PERN Stack
- [Tone.js](https://tonejs.github.io/)

## Local Installation

If you'd prefer to run Rockwriter locally:

1. Download both the `chord-app-front` and `chord-app-back` repositories.
2. In each repository, run:
   ```bash
   npm run dev
   ```

## 🎵 How to Use

### 1. Explore with "Creep"
"Creep" is a single demo song meant to let you explore the app itself. Feel free to click around!
>  Saving is disabled for this song — any changes made will not persist through a refresh.

### 2. Create an Account
Login/signup is authenticated using JWT. This is a prerequisite for creating your own songs.

### 3. Start a New Song
Click the **+** button to create your own song.

### 4. Build Your Tracks
Within a song, you'll find several clickable instruments on the right side of the page, each leading to its own page. Click around the blocks to make sound, then press **Save** to create a track. Tracks are what get combined to play all instruments together.

| Instrument | How It Works |
|---|---|
| **Drums** | Made up of kick, snare, and hi-hat. Click to toggle timings on/off. |
| **Bass / Lead** | Same UI as with each other, but with octave ranges (for now). Click divs to toggle timings on/off. However, they functionally sound the same if the same notes are played. |
| **Rhythm** | Choose chord(s), then click the bottom row of squares to set the strumming pattern. An empty row means no sound. |

### 5. Put It All Together
Once you've made your tracks, go to your song page and click **Automation**. Drag your tracks into the squares, then hit **Play All** to hear your creation!

##  Known Bugs / Issues

- Placing a track on an unintended channel (e.g., a drum track in the bass channel) will cause an error.
- Some niche movable chords on Rhythm Guitar may be inaccurate.

##  Planned Features

- Use actual instrument samples instead of Tone.js's native PolySynth.
- Add a default "empty" track, or allow deletion/drag-out of existing tracks.
