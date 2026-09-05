Rockwriter (?)

A web based songwriting host inspired by a chrome music lab music assignment I had when I was in elementary school (Thank you Mr Savoy!)

No Installation Needed, please visit https://rockwriter-bwm3r5cq3-sackie08133.vercel.app/
However, if you would like to install locally please download both the chord-app-front and chord-app-back repositories and run them using "npm run dev" on the command panel.
(Written in React, JS, CSS, HTML, Postgre SQL, PERN stack, Tone.js library) 



 1) "Creep" is a single song meant to explore the app itself. Feel free to click around. However, saving is disabled and any changes made will not be kept through refreshes.
 2) Login / Signup is authenticated using JWT. This is a prerequisite if you would like to make your own "song"
 3) + button will prompt you to make your own song
 4) within the song, there are several clickable instruments, (right side of page) each leading to their own page. Click around the blocks to make some sound, and press the "save" button to create a track. Tracks are what are used to play all of the instruments at once
    4.1) Drum: Made up of kick, snare, hihat. Click to turn on / off certain timings
    4.2) Bass / Lead: Essentially the same UI, except for octave ranges (for now). Click on divs to turn on / off certain timings
    4.3) Rhythm: Choose chord(s) and click on bottom row of squares to control strumming pattern. An empty row will lead to no sound
 6) After you made your "tracks", go to your song page and click on automation. Then you can drag your tracks into the squares. Click play all to hear your creation!
    

 KNOWN BUGS / ISSUES
   - putting a track on an unintended channel, for example, a drum track into the bass channel will cause an error
   - A few of the niche movable chords on "rhythm guitar" may be inaccurate. 

PLANNED FEATURES 
  - use actual instrument samples instead of polysynth native to tone.js
  - add an "empty" track as a default OR allow deletion / drag out of tracks.
