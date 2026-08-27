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

export default function Automation() {
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const resizing = useRef(false);
  const [placements, setPlacements] = useState({});
  // e.g. { "drum-0": {id: 5, name: "Verse Beat"}, "bass-3": {id: 12, name: "Bassline A"} }

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
    // Clear the previously selected track
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
    seqsRef.current.forEach((seq) => {
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
    if (channel === "rhythm") return track; // rhythm tracks are already fully-loaded from the sidebar fetch
    return null;
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

    // Stop previous arrangement
    stopAllSequences();
    Tone.Transport.bpm.value = bpm;
    const newSeqs = [];

    // Loop through EVERY block in the arrangement
    for (const [key, track] of Object.entries(placements)) {
      if (!track) continue;

      const [channel, col] = key.split("-");
      const blockIndex = Number(col);

      try {
        const data = await fetchTrackData(channel, track);

        if (!data) continue;

        let seq = null;
        const startTime = `${blockIndex}:0:0`;

        if (channel === "drum") {
          seq = playDrumTrack(data, bpm, startTime, false);
        }
        if (channel === "bass") {
          seq = playGuitarTrack(data, bpm, startTime, false, "bass");
        }
        if (channel === "lead") {
          seq = playGuitarTrack(data, bpm, startTime, false, "guitar");
        }
        if (channel === "rhythm") {
          seq = playRhythmTrack(
            data.chord_slots,
            data.strum_pattern,
            bpm,
            startTime,
            false,
          );
        }

        if (seq) {
          newSeqs.push(seq);
        }
      } catch (error) {
        console.error(
          `Failed to create ${channel} sequence at block ${blockIndex}:`,
          error,
        );
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
          </div>
        </header>

        <main className="automation-workspace">
          {/* SIDEBAR */}
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
          {/* SEQUENCER */}

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
              {/* DRUM */}
              <div
                className={`automation-channel-row ${
                  selectedInstrument === "drum"
                    ? "automation-channel-row-selected"
                    : ""
                }`}
                id="automation-channel-drum"
                data-channel="drum"
                onClick={() => handleInstrumentClick("drum")}
              >
                <div className="automation-channel-label">
                  <span className="automation-channel-number">01</span>

                  <span className="automation-channel-name">DRUM</span>
                </div>

                <div className="automation-drop-zone-row">
                  {Array.from({ length: 16 }).map((_, blockIndex) => {
                    const key = `drum-${blockIndex}`;
                    const placedTrack = placements[key];
                    return (
                      <div
                        key={blockIndex}
                        className={`automation-block ${placedTrack ? "filled" : ""}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const trackName = e.dataTransfer.getData("track");
                          const parsedTrack = JSON.parse(trackName);
                          const key = `drum-${blockIndex}`;
                          setPlacements((prev) => ({
                            ...prev,
                            [key]: parsedTrack,
                          }));
                        }}
                      >
                        {placedTrack?.name}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BASS */}
              <div
                className={`automation-channel-row ${
                  selectedInstrument === "bass"
                    ? "automation-channel-row-selected"
                    : ""
                }`}
                id="automation-channel-bass"
                data-channel="bass"
                onClick={() => handleInstrumentClick("bass")}
              >
                <div className="automation-channel-label">
                  <span className="automation-channel-number">02</span>

                  <span className="automation-channel-name">BASS</span>
                </div>
                <div className="automation-drop-zone-row">
                  {Array.from({ length: 16 }).map((_, blockIndex) => {
                    const key = `bass-${blockIndex}`;
                    const placedTrack = placements[key];
                    return (
                      <div
                        key={blockIndex}
                        className={`automation-block ${placedTrack ? "filled" : ""}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const trackName = e.dataTransfer.getData("track");
                          const parsedTrack = JSON.parse(trackName);
                          const key = `bass-${blockIndex}`;
                          setPlacements((prev) => ({
                            ...prev,
                            [key]: parsedTrack,
                          }));
                        }}
                      >
                        {placedTrack?.name}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RHYTHM */}
              <div
                className={`automation-channel-row ${
                  selectedInstrument === "rhythm"
                    ? "automation-channel-row-selected"
                    : ""
                }`}
                id="automation-channel-rhythm"
                data-channel="rhythm"
                onClick={() => handleInstrumentClick("rhythm")}
              >
                <div className="automation-channel-label">
                  <span className="automation-channel-number">03</span>

                  <span className="automation-channel-name">RHYTHM</span>
                </div>

                <div className="automation-drop-zone-row">
                  {Array.from({ length: 16 }).map((_, blockIndex) => {
                    const key = `rhythm-${blockIndex}`;
                    const placedTrack = placements[key];
                    return (
                      <div
                        key={blockIndex}
                        className={`automation-block ${placedTrack ? "filled" : ""}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const trackName = e.dataTransfer.getData("track");
                          const parsedTrack = JSON.parse(trackName);
                          const key = `rhythm-${blockIndex}`;
                          setPlacements((prev) => ({
                            ...prev,
                            [key]: parsedTrack,
                          }));
                        }}
                      >
                        {placedTrack?.name}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LEAD */}

              <div
                className={`automation-channel-row ${
                  selectedInstrument === "lead"
                    ? "automation-channel-row-selected"
                    : ""
                }`}
                id="automation-channel-lead"
                data-channel="lead"
                onClick={() => handleInstrumentClick("lead")}
              >
                <div className="automation-channel-label">
                  <span className="automation-channel-number">04</span>

                  <span className="automation-channel-name">LEAD</span>
                </div>

                <div className="automation-drop-zone-row">
                  {Array.from({ length: 16 }).map((_, blockIndex) => {
                    const key = `lead-${blockIndex}`;
                    const placedTrack = placements[key];
                    return (
                      <div
                        key={blockIndex}
                        className={`automation-block ${placedTrack ? "filled" : ""}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const trackName = e.dataTransfer.getData("track");
                          const parsedTrack = JSON.parse(trackName);
                          const key = `lead-${blockIndex}`;
                          setPlacements((prev) => ({
                            ...prev,
                            [key]: parsedTrack,
                          }));
                        }}
                      >
                        {placedTrack?.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
