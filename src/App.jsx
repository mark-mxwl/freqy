import { useState, useEffect } from "react";
import Knob from "./components/Knob.jsx";
import DragDrop from "./components/DragDrop.jsx";

// CREATE AUDIO CONTEXT & FILTER
const ctx = new AudioContext();
const filter = ctx.createBiquadFilter();
filter.connect(ctx.destination);

let bufferLength;
let playBufferedSample;
let stopBufferedSample;

export default function App() {
  ctx.onstatechange = () => console.log(ctx.state, ctx.currentTime.toFixed(2));

  const [freq, setFreq] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [uploadedAudio, setUploadedAudio] = useState(null);

  // SET FILTER PROPERTIES
  filter.type = "notch";
  filter.Q.value = 0.7;
  filter.frequency.value = freq;

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
          playBufferedSample = () => soundSource.start();
          stopBufferedSample = () => soundSource.stop();
          bufferLength = Number(soundSource.buffer.duration.toFixed(0) * 1000);
        });
      };
      console.log("buffer created!");
    }
    console.log("component mounted!");
  }, [uploadedAudio, toggle]);

  // Note: start()/stop() can only be called ONCE per buffer. It's not so much like PLAY, but
  // more like POWER. You power the buffer on; you power it off. Once it's off, it goes to GC.

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
    if (!isPlaying) {
      playBufferedSample();
      setInterval(() => {
        setToggle((prev) => !prev);
        playBufferedSample();
      }, bufferLength);
    }
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
        <h1>Notchy</h1>
        <DragDrop uploadedAudio={setUploadedAudio} />
        <div className="plugin-drag-drop" style={{ marginTop: "25px" }}>
          <div className="plugin-control-bar">
            <div onClick={playSample} id="play-btn">
              <img
                src="src/assets/icon/play-solid.svg"
                className="plugin-control-buttons"
              />
            </div>
            <div onClick={stopSample} id="stop-btn">
              <img
                src="src/assets/icon/stop-solid.svg"
                className="plugin-control-buttons"
              />
            </div>
            <div onClick={loopSample} id="loop-btn">
              <img
                src="src/assets/icon/repeat-solid.svg"
                className="plugin-control-buttons"
              />
            </div>
          </div>
        </div>
        <Knob freq={setFreq} />
      </div>
      <div className="copyright-and-links">
        <p style={{ marginLeft: "9px" }}>MIT 2024 © Mark Maxwell</p>
        <div>
          <a href="https://github.com/mark-mxwl" target="_blank">
            <img src="src/assets/icon/github.svg" className="link-icons" />
          </a>
          <a href="https://markmaxwelldev.com" target="_blank">
            <img
              src="src/assets/icon/M_nav_icon_1.svg"
              className="link-icons"
            />
          </a>
        </div>
      </div>
    </>
  );
}
