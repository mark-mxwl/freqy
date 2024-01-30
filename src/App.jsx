import { useState, useEffect } from "react";
import Knob from "./components/Knob.jsx";
import DragDrop from "./components/DragDrop.jsx";

// CREATE AUDIO CONTEXT & FILTER
const ctx = new AudioContext();
const filter = ctx.createBiquadFilter();
const filterTypes = ["lowpass", "highpass", "bandpass", "notch"];
filter.connect(ctx.destination);

let bufferLength;
let playBufferedSample;
let stopBufferedSample;
let loopBufferedSample;

let n = 0;

export default function App() {
  ctx.onstatechange = () => console.log(ctx.state, ctx.currentTime.toFixed(2));

  const [freq, setFreq] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [uploadedAudio, setUploadedAudio] = useState(null);

  // SET FILTER PROPERTIES
  filter.type = filterTypes[n];
  filter.Q.value = 0.7;
  filter.frequency.value = freq;

  // Note: start()/stop() can only be called ONCE per buffer. It's not so much like PLAY, but
  // more like POWER. You power the buffer on; you power it off. Once it's off, it goes to GC.

  useEffect(() => {
    if (uploadedAudio) {
      // DECODE UPLOADED AUDIO & CREATE BUFFER
      const reader1 = new FileReader();
      reader1.readAsArrayBuffer(uploadedAudio);
      reader1.onload = function (ev) {
        ctx.decodeAudioData(ev.target.result).then(function (buffer) {
          const soundSource = ctx.createBufferSource();
          soundSource.buffer = buffer;
          soundSource.connect(filter);
          // console.log(soundSource);
          playBufferedSample = () => soundSource.start();
          stopBufferedSample = () => soundSource.stop();
          loopBufferedSample = () => {
            soundSource.loop = true;
            soundSource.loopEnd = buffer.duration;
          };
          bufferLength = Number(soundSource.buffer.duration.toFixed(0) * 1000);
        });
      };
      // console.log("buffer created!");
    }
    // console.log("component mounted!");
  }, [uploadedAudio, toggle]);

  function handleClick(e) {
    n = e.target.value;
    // console.log(n)
  }

  // PLAY, STOP, & LOOP BUFFERED AUDIO
  function playSample() {
    ctx.resume();
    setIsPlaying(true);
    playBufferedSample();
    setTimeout(suspendContext, bufferLength);
  }

  function stopSample() {
    stopBufferedSample();
    suspendContext();
  }

  function loopSample() {
    ctx.resume();
    setIsPlaying(true);
    playBufferedSample();
    loopBufferedSample();
  }

  // SUSPEND AUDIO CONTEXT, INIT NEW BUFFER
  function suspendContext() {
    ctx.suspend();
    setToggle((prev) => (prev = !prev));
    setIsPlaying(false);
  }

  return (
    <>
      <div className="plugin-container">
        <h1>FREQY</h1>
        <DragDrop uploadedAudio={setUploadedAudio} />
        <div className="plugin-drag-drop" style={{ marginTop: "25px" }}>
          <div className="plugin-control-bar">
            <div className="plugin-control-bar-L">
              <fieldset>
                <legend>Mode {">>"}</legend>
                <div title="Lowpass filter">
                  <input
                    type="radio"
                    id="lp"
                    name="mode"
                    value="0"
                    onClick={handleClick}
                    defaultChecked
                  />
                  <label htmlFor="lp">low</label>
                </div>
                <div title="Highpass filter">
                  <input
                    type="radio"
                    id="hp"
                    name="mode"
                    value="1"
                    onClick={handleClick}
                  />
                  <label htmlFor="hp">high</label>
                </div>
                <div title="Bandpass filter">
                  <input
                    type="radio"
                    id="bp"
                    name="mode"
                    value="2"
                    onClick={handleClick}
                  />
                  <label htmlFor="bp">band</label>
                </div>
                <div title="Notch filter">
                  <input
                    type="radio"
                    id="nc"
                    name="mode"
                    value="3"
                    onClick={handleClick}
                  />
                  <label htmlFor="nc">notch</label>
                </div>
              </fieldset>
            </div>
            <div className="plugin-control-bar-R">
              <div id="play-btn">
                <img
                  src="src/assets/icon/play-solid.svg"
                  alt="play"
                  title="Play"
                  className="plugin-control-buttons"
                  onClick={playSample}
                  tabIndex={0}
                  onKeyDown={playSample}
                />
              </div>
              <div id="stop-btn">
                <img
                  src="src/assets/icon/stop-solid.svg"
                  alt="stop"
                  title="Stop"
                  className="plugin-control-buttons"
                  onClick={stopSample}
                  tabIndex={0}
                  onKeyDown={stopSample}
                />
              </div>
              <div id="loop-btn">
                <img
                  src="src/assets/icon/repeat-solid.svg"
                  alt="loop"
                  title="Loop"
                  className="plugin-control-buttons"
                  onClick={loopSample}
                  tabIndex={0}
                  onKeyDown={loopSample}
                />
              </div>
            </div>
          </div>
        </div>
        <Knob freq={setFreq} />
      </div>
      <div className="copyright-and-links">
        <p style={{ marginLeft: "9px" }}>MIT 2024 © Mark Maxwell</p>
        <div>
          <a href="https://github.com/mark-mxwl" target="_blank">
            <img
              src="src/assets/icon/github.svg"
              alt="github"
              className="link-icons"
            />
          </a>
          <a href="https://markmaxwelldev.com" target="_blank">
            <img
              src="src/assets/icon/M_nav_icon_1.svg"
              alt="markmaxwelldev.com"
              className="link-icons"
            />
          </a>
        </div>
      </div>
    </>
  );
}
