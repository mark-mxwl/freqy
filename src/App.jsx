import { useState, useEffect } from "react";
import Knob from "./components/Knob.jsx";
import DragDrop from "./components/DragDrop.jsx";
import InfoModal from "./components/InfoModal.jsx";

const ctx = new AudioContext();
const reader1 = new FileReader();
const filter = ctx.createBiquadFilter();
const filterTypes = ["lowpass", "highpass", "bandpass", "notch"];
filter.connect(ctx.destination);

let currentBuffer;
let bufferLength;
let playBufferedSample;
let stopBufferedSample;
let loopBufferedSample;

let n = 0;

export default function App() {
  // ctx.onstatechange = () => console.log(ctx.state, ctx.currentTime.toFixed(2));

  const [freq, setFreq] = useState(1000);
  const [toggle, setToggle] = useState(false);
  const [uploadedAudio, setUploadedAudio] = useState(null);
  const [bufferReady, setBufferReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const handleModal = () => setIsVisible(true);
  const handleClick = (e) => n = e.target.value;

  filter.type = filterTypes[n];
  filter.Q.value = 0.7;
  filter.frequency.value = freq;

  // CREATE BUFFER
  useEffect(() => {
    if (uploadedAudio) {
      reader1.readAsArrayBuffer(uploadedAudio);
      reader1.onload = function (e) {
        ctx.decodeAudioData(e.target.result).then(function (buffer) {
          currentBuffer = buffer;
          console.log("buffer created!");
          console.log(currentBuffer);
          setBufferReady(true);
          setToggle((prev) => (prev = !prev));
        });
      };
    }
  }, [uploadedAudio]);

  // CREATE SOURCE NODE
  useEffect(() => {
    if (bufferReady === true) {
      const soundSource = ctx.createBufferSource();
      soundSource.buffer = currentBuffer;
      soundSource.connect(filter);
      playBufferedSample = () => soundSource.start();
      stopBufferedSample = () => soundSource.stop();
      loopBufferedSample = () => {
        soundSource.loop = true;
        soundSource.loopEnd = currentBuffer.duration;
      };
      bufferLength = Number(soundSource.buffer.duration.toFixed(0) * 1000);
      console.log("source node created!");
    }
  }, [toggle]);

  function keyDown(e) {
    if (e.key === "Enter" && e.target.id === "play-1") {
      playSample();
    }
    if (e.key === "Enter" && e.target.id === "stop-1") {
      stopSample();
    }
    if (e.key === "Enter" && e.target.id === "loop-1") {
      loopSample();
    }
  }

  function playSample() {
    ctx.resume();
    playBufferedSample();
    setTimeout(suspendContext, bufferLength);
  }

  function stopSample() {
    stopBufferedSample();
    suspendContext();
  }

  function loopSample() {
    ctx.resume();
    playBufferedSample();
    loopBufferedSample();
  }

  function suspendContext() {
    ctx.suspend();
    setToggle((prev) => (prev = !prev));
  }

  return (
    <>
      <InfoModal
        isVisible={isVisible}
        toggleModal={() => setIsVisible(false)}
      />
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
                  alt="Play"
                  title="Play"
                  id="play-1"
                  className="plugin-control-buttons"
                  onClick={playSample}
                  tabIndex={0}
                  onKeyDown={keyDown}
                />
              </div>
              <div id="stop-btn">
                <img
                  src="src/assets/icon/stop-solid.svg"
                  alt="Stop"
                  title="Stop"
                  id="stop-1"
                  className="plugin-control-buttons"
                  onClick={stopSample}
                  tabIndex={0}
                  onKeyDown={keyDown}
                />
              </div>
              <div id="loop-btn">
                <img
                  src="src/assets/icon/repeat-solid.svg"
                  alt="Loop"
                  title="Loop"
                  id="loop-1"
                  className="plugin-control-buttons"
                  onClick={loopSample}
                  tabIndex={0}
                  onKeyDown={keyDown}
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
          <img
            src="src/assets/icon/universal-access-solid.svg"
            alt="Universal Access"
            className="link-icons"
            onClick={handleModal}
            tabIndex={0}
            onKeyDown={handleModal}
          />
          <a href="https://github.com/mark-mxwl" target="_blank">
            <img
              src="src/assets/icon/github.svg"
              alt="GitHub"
              className="link-icons"
            />
          </a>
          <a href="https://markmaxwelldev.com" target="_blank">
            <img
              src="src/assets/icon/M_nav_icon_1.svg"
              alt="Website"
              className="link-icons"
            />
          </a>
        </div>
      </div>
    </>
  );
}
