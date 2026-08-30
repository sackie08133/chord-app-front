import React, { useEffect, useRef, useState } from "react";
import {
  fetchDrumTracksFor,
  fetchGuitarTracksFor,
  fetchRhythmTracksFor,
  fetchBpm,
  fetchDrumHitsFor,
  fetchGuitarNotesFor,
  apiRequest,
} from "../components/Utils";
import {
  playDrumTrack,
  playGuitarTrack,
  playRhythmTrack,
} from "../components/Playback";
import { useAuth } from "../components/Context";
import { useNavigate, useParams } from "react-router-dom";
import * as Tone from "tone";
import "./Automation.css";

const BLOCK_LENGTH_BARS = 2;

export default function Automation() {
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const resizing = useRef(false);
  const [placements, setPlacements] = useState({});

  const [tracks, setTracks] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [bpm, setBPM] = useState(null);
  const seqsRef = useRef([]);
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const startResize = (e) => {
    e.preventDefault();
    resizing.current = true;
    const handleMouseMove = (event) => {
      if (!resizing.current) return;
      const newWidth = Math.min(Math.max(event.clientX, 200), 500);
      setSidebarWidth(newWidth);
    };
    const stopResize = () => {
      resizing.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResize);
  };

  const handleDragStart = (e, track) => {
    e.dataTransfer.setData("track", JSON.stringify(track));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleInstrumentClick = async (instrument) => {
    setSelectedInstrument(instrument);
    setSelectedTrack(null);

    try {
      let data = [];
      if (instrument === "drum") {
        data = await fetchDrumTracksFor(id, token);
      }
      if (instrument === "rhythm") {
        data = await fetchRhythmTracksFor(id, token);
      }
      if (
        instrument === "bass" ||
        instrument === "guitar" ||
        instrument === "lead"
      ) {
        const guitarTracks = await fetchGuitarTracksFor(id, token);
        data = guitarTracks.filter(
          (track) =>
            track.instrument ===
            (instrument === "lead" ? "guitar" : instrument),
        );
      }
      setTracks(data || []);
    } catch (error) {
      console.error(`Failed to load ${instrument} tracks:`, error);
      setTracks([]);
    }
  };

  const handleTrackClick = (track) => {
    setSelectedTrack(track.id);
  };

  const handleSave = async () => {
    if (!id) {
      alert("Song not found");
      return;
    }
    try {
      for (const [key, track] of Object.entries(placements)) {
        const [trackType, col] = key.split("-");
        await apiRequest(
          `/automation/${id}`,
          {
            trackType,
            trackId: track.id,
            name: track.name,
            col: Number(col),
          },
          token,
        );
      }
      alert("Automation saved");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const loadAutomation = async () => {
    try {
      const data = await apiRequest(`/automation/${id}`, null, token, "GET");
      const loadedPlacements = {};
      for (const row of data) {
        const key = `${row.track_type}-${row.col}`;
        loadedPlacements[key] = { id: row.track_id, name: row.name };
      }
      setPlacements(loadedPlacements);
    } catch (error) {
      console.error("Failed to load automation:", error);
    }
  };

  const stopAllSequences = () => {
    seqsRef.current.forEach(({ seq }) => {
      if (!seq) return;
      try {
        seq.stop();
        seq.dispose();
      } catch (error) {
        console.warn("Failed to clean up sequence:", error);
      }
    });

    seqsRef.current = [];
    Tone.Transport.stop();
    Tone.Transport.cancel();
  };

  async function fetchTrackData(channel, track) {
    if (channel === "drum") return await fetchDrumHitsFor(track.id, token);
    if (channel === "bass" || channel === "lead")
      return await fetchGuitarNotesFor(track.id, token);
    if (channel === "rhythm") {
      const allRhythmTracks = await fetchRhythmTracksFor(id, token);
      return allRhythmTracks.find((t) => t.id === track.id) || null;
    }
    return null;
  }

  function buildRuns(channel) {
    const runs = [];
    let currentRun = null;

    for (let block = 0; block < 16; block++) {
      const key = `${channel}-${block}`;
      const track = placements[key] || null;

      if (track && currentRun && currentRun.track.id === track.id) {
        currentRun.endBlock = block;
      } else {
        if (currentRun) runs.push(currentRun);
        currentRun = track
          ? { track, startBlock: block, endBlock: block }
          : null;
      }
    }
    if (currentRun) runs.push(currentRun);

    return runs;
  }

  // Fetches one run's track data, starts it looping at the run's start time, auto end when track end
  async function playRun(channel, run) {
    const data = await fetchTrackData(channel, run.track);
    if (!data) return null;

    const startBar = run.startBlock * BLOCK_LENGTH_BARS;
    const numBlocks = run.endBlock - run.startBlock + 1;
    const endBar = startBar + numBlocks * BLOCK_LENGTH_BARS;

    const startTime = `${startBar}:0:0`;
    const stopTime = `${endBar}:0:0`;

    let seq = null;
    if (channel === "drum") seq = playDrumTrack(data, bpm, startTime, true);
    if (channel === "bass")
      seq = playGuitarTrack(data, bpm, startTime, true, "bass");
    if (channel === "lead")
      seq = playGuitarTrack(data, bpm, startTime, true, "guitar");
    if (channel === "rhythm")
      seq = playRhythmTrack(
        data.chord_slots,
        data.strum_pattern,
        bpm,
        startTime,
        true,
      );

    if (!seq) return null;

    const eventId = Tone.Transport.scheduleOnce(() => {
      try {
        seq.stop();
        seq.dispose();
      } catch (error) {
        console.warn("Failed to auto-stop run:", error);
      }
    }, stopTime);

    return { seq, eventId };
  }

  const handlePlayAll = async () => {
    if (!bpm) {
      console.error("BPM has not loaded yet.");
      return;
    }
    if (Object.keys(placements).length === 0) {
      console.warn("There are no tracks in the arrangement.");
      return;
    }

    await Tone.start();
    stopAllSequences();
    Tone.Transport.bpm.value = bpm;

    const channels = ["drum", "bass", "rhythm", "lead"];
    const newSeqs = [];

    for (const channel of channels) {
      const runs = buildRuns(channel);

      for (const run of runs) {
        try {
          const result = await playRun(channel, run);
          if (result) newSeqs.push(result);
        } catch (error) {
          console.error(`Failed to schedule ${channel} run:`, error);
        }
      }
    }

    seqsRef.current = newSeqs;
    Tone.Transport.start();
  };

  useEffect(() => {
    return () => {
      stopAllSequences();
    };
  }, []);

  useEffect(() => {
    if (!id || !token) return;

    const loadData = async () => {
      try {
        await loadAutomation();
        const bpmValue = await fetchBpm(id, token);
        setBPM(bpmValue);
      } catch (error) {
        console.error("Failed to load automation data:", error);
      }
    };

    loadData();
  }, [id, token]);

  return (
    <div className="automation-hud">
      <div className="automation-canvas">
        <header className="automation-header">
          <div className="automation-controls">
            <button
              className="automation-button"
              id="automation-save-button"
              type="button"
              onClick={handleSave}
            >
              SAVE
            </button>

            <button
              className="automation-button"
              id="automation-back-button"
              type="button"
              onClick={() => navigate(-1)}
            >
              BACK
            </button>

            <button
              className="automation-button automation-button-primary"
              id="automation-play-button"
              type="button"
              onClick={handlePlayAll}
            >
              PLAY
            </button>

            <button
              className="automation-button"
              id="automation-stop-button"
              type="button"
              onClick={stopAllSequences}
            >
              STOP
            </button>
          </div>
        </header>

        <main className="automation-workspace">
          <aside
            className="automation-track-sidebar"
            style={{ width: `${sidebarWidth}px` }}
          >
            <div className="automation-sidebar-header">
              <div>
                <span className="automation-section-label">TRACKS</span>
                <span className="automation-section-count">
                  {String(tracks.length).padStart(2, "0")}
                </span>
              </div>

              <button
                className="automation-sidebar-add"
                id="automation-add-track-button"
                type="button"
              >
                +
              </button>
            </div>

            <div className="automation-sidebar-content">
              {tracks.length === 0 && (
                <div className="automation-empty-tracks">
                  SELECT AN INSTRUMENT
                </div>
              )}

              {tracks.map((track) => {
                const isSelected = selectedTrack === track.id;
                return (
                  <div
                    key={track.id}
                    className={`automation-track-card ${
                      isSelected ? "automation-track-card-selected" : ""
                    }`}
                    draggable
                    onClick={() => handleTrackClick(track)}
                    onDragStart={(e) => handleDragStart(e, track)}
                  >
                    <div className="automation-track-card-grip">
                      <span />
                      <span />
                      <span />
                    </div>

                    <div className="automation-track-color" />

                    <div className="automation-track-info">
                      <span className="automation-track-name">
                        {track.name || track.title || `Track ${track.id}`}
                      </span>
                      <span className="automation-track-meta">
                        {selectedInstrument
                          ? selectedInstrument.toUpperCase()
                          : "TRACK"}
                        {" · "}
                        {String(track.id).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="automation-track-waveform">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="automation-sidebar-footer">
              <span>DRAG TRACK</span>
              <span>+</span>
            </div>

            <div
              className="automation-sidebar-resize"
              onMouseDown={startResize}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize track sidebar"
            >
              <div className="automation-resize-line" />
              <div className="automation-resize-grip">
                <span />
                <span />
                <span />
              </div>
            </div>
          </aside>

          <section className="automation-sequencer">
            <div className="automation-sequencer-header">
              <span className="automation-section-label">ARRANGEMENT</span>
              <span className="automation-sequencer-subtitle">
                DROP TRACKS INTO CHANNELS
              </span>
            </div>

            <div className="automation-timeline">
              <div className="automation-timeline-label">TIME</div>
              {Array.from({ length: 16 }).map((_, index) => (
                <div className="automation-timeline-marker" key={index}>
                  {String(index + 1).padStart(2, "0")}
                </div>
              ))}
            </div>

            <div className="automation-channels">
              {["drum", "bass", "rhythm", "lead"].map((channel, i) => (
                <div
                  key={channel}
                  className={`automation-channel-row ${
                    selectedInstrument === channel
                      ? "automation-channel-row-selected"
                      : ""
                  }`}
                  id={`automation-channel-${channel}`}
                  data-channel={channel}
                  onClick={() => handleInstrumentClick(channel)}
                >
                  <div className="automation-channel-label">
                    <span className="automation-channel-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="automation-channel-name">
                      {channel.toUpperCase()}
                    </span>
                  </div>

                  <div className="automation-drop-zone-row">
                    {Array.from({ length: channel === "rhythm" ? 16 : 16 }).map(
                      (_, blockIndex) => {
                        const key = `${channel}-${blockIndex}`;
                        const placedTrack = placements[key];
                        return (
                          <div
                            key={blockIndex}
                            className={`automation-block ${placedTrack ? "filled" : ""}`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              const trackString =
                                e.dataTransfer.getData("track");
                              const parsedTrack = JSON.parse(trackString);
                              setPlacements((prev) => ({
                                ...prev,
                                [key]: parsedTrack,
                              }));
                            }}
                          >
                            {placedTrack?.name}
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
