import React, { useRef, useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom";
import "./Automation.css"

export default function Automation() {
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const resizing = useRef(false)
  const {id} = useParams()
  const navigate = useNavigate()

  const startResize = (e) => {
    e.preventDefault()
    resizing.current = true

    const handleMouseMove = (event) => {
      if (!resizing.current) return

      const newWidth = Math.min(
        Math.max(event.clientX, 200),
        500
      )

      setSidebarWidth(newWidth)
    }

    const stopResize = () => {
      resizing.current = false

      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", stopResize)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", stopResize)
  }

  const handleDragStart = (e) => {
    e.dataTransfer.setData("track", "example-track")
    e.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="automation-hud">
      <div className="automation-canvas">

        <header className="automation-header">
          <div className="automation-controls">

            <button
              className="automation-button"
              id="automation-save-button"
              type="button"
            >
              SAVE
            </button>

            <button
              className="automation-button"
              id="automation-back-button"
              type="button"
              onClick={()=> navigate(-1)}
            >
              BACK
            </button>

            <button
              className="automation-button automation-button-primary"
              id="automation-play-button"
              type="button"
            >
              PLAY
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
                <span className="automation-section-label">
                  TRACKS
                </span>

                <span className="automation-section-count">
                  01
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
              <div
                className="automation-track-card"
                id="automation-track-example"
                draggable
                onDragStart={handleDragStart}
              >
                <div className="automation-track-card-grip">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="automation-track-color" />

                <div className="automation-track-info">
                  <span className="automation-track-name">
                    Example Track
                  </span>

                  <span className="automation-track-meta">
                    AUDIO · 01
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
                </div>
              </div>
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
              <span className="automation-section-label">
                ARRANGEMENT
              </span>

              <span className="automation-sequencer-subtitle">
                DROP TRACKS INTO CHANNELS
              </span>
            </div>

            <div className="automation-timeline">

              <div className="automation-timeline-label">
                TIME
              </div>

              {Array.from({ length: 16 }).map((_, index) => (
                <div
                  className="automation-timeline-marker"
                  key={index}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
              ))}

            </div>

            <div className="automation-channels">
              <div
                className="automation-channel-row"
                id="automation-channel-drum"
                data-channel="drum"
              >
                <div className="automation-channel-label">
                  <span className="automation-channel-number">
                    01
                  </span>

                  <span className="automation-channel-name">
                    DRUM
                  </span>
                </div>

                <div
                  className="automation-drop-zone"
                  id="automation-drop-zone-drum"
                  data-drop-target="drum"
                >
                  <div className="automation-drop-zone-content">
                    DROP TRACK
                  </div>
                </div>
              </div>

              <div
                className="automation-channel-row"
                id="automation-channel-bass"
                data-channel="bass"
              >
                <div className="automation-channel-label">
                  <span className="automation-channel-number">
                    02
                  </span>

                  <span className="automation-channel-name">
                    BASS
                  </span>
                </div>

                <div
                  className="automation-drop-zone"
                  id="automation-drop-zone-bass"
                  data-drop-target="bass"
                >
                  <div className="automation-drop-zone-content">
                    DROP TRACK
                  </div>
                </div>
              </div>

              <div
                className="automation-channel-row"
                id="automation-channel-rhythm"
                data-channel="rhythm"
              >
                <div className="automation-channel-label">
                  <span className="automation-channel-number">
                    03
                  </span>

                  <span className="automation-channel-name">
                    RHYTHM
                  </span>
                </div>

                <div
                  className="automation-drop-zone"
                  id="automation-drop-zone-rhythm"
                  data-drop-target="rhythm"
                >
                  <div className="automation-drop-zone-content">
                    DROP TRACK
                  </div>
                </div>
              </div>

              <div
                className="automation-channel-row"
                id="automation-channel-lead"
                data-channel="lead"
              >
                <div className="automation-channel-label">
                  <span className="automation-channel-number">
                    04
                  </span>

                  <span className="automation-channel-name">
                    LEAD
                  </span>
                </div>

                <div
                  className="automation-drop-zone"
                  id="automation-drop-zone-lead"
                  data-drop-target="lead"
                >
                  <div className="automation-drop-zone-content">
                    DROP TRACK
                  </div>
                </div>
              </div>

            </div>

          </section>
        </main>

      </div>
    </div>
  )
}