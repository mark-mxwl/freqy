import React from "react";
import { useState, useEffect } from "react";
import Knob from "./components/Knob.jsx";
import DragDrop from "./components/DragDrop.jsx";
import InfoModal from "./components/InfoModal.jsx";
import "./App.css"

const ctx = new AudioContext();
const reader1 = new FileReader();
const filter = ctx.createBiquadFilter();
const filterTypes = [
  {
    type: "lowpass",
    q: 4,
  },
  {
    type: "highpass",
    q: 4,
  },
  {
    type: "bandpass",
    q: 0.7,
  },
  {
    type: "notch",
    q: 0.7,
  },
];
filter.connect(ctx.destination);

let currentBuffer;
let bufferLength;
let playBufferedSample;
let stopBufferedSample;
let loopBufferedSample;

const filterFreqRange = 10500;
const midiCCRange = 128;
const midiIncrement = (filterFreqRange / midiCCRange).toFixed(0);
let midiToFreq = 5000;

let safariAgent = navigator.userAgent.indexOf("Safari") > -1;
let chromeAgent = navigator.userAgent.indexOf("Chrome") > -1;

export default function App() {
  const [uploadedAudio, setUploadedAudio] = useState(null);
  const [bufferReady, setBufferReady] = useState(false);
  const [freq, setFreq] = useState(5000);

  const [midiCC, setMidiCC] = useState(0);
  const [midiValue, setMidiValue] = useState(0);
  const [useMidi, setUseMidi] = useState(false);
  const [midiDeviceName, setMidiDeviceName] = useState("");

  const [toggle, setToggle] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [n, setN] = useState(0);

  const handleModal = () => setIsVisible(true);
  const handleClick = (e) => setN(e.target.value);

  filter.type = filterTypes[n].type;
  filter.Q.value = filterTypes[n].q;
  filter.frequency.value = freq;

  function discardDuplicateUserAgent() {
    if (chromeAgent && safariAgent) safariAgent = false;
  }

  // AUDIO BUFFER
  useEffect(() => {
    if (uploadedAudio) {
      reader1.readAsArrayBuffer(uploadedAudio);
      reader1.onload = function (e) {
        ctx.decodeAudioData(e.target.result).then(function (buffer) {
          currentBuffer = buffer;
          setBufferReady(true);
          setToggle((prev) => (prev = !prev));
        });
      };
    }
  }, [uploadedAudio]);

  // SOURCE NODE
  useEffect(() => {
    if (bufferReady) {
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
    }
  }, [toggle]);

  // MIDI ACCESS
  useEffect(() => {
    discardDuplicateUserAgent();
    if (!safariAgent) {
      navigator.requestMIDIAccess().then(
        (access) => {
          access.addEventListener("statechange", findMidiDevices);
          const inputs = access.inputs;
          inputs.forEach((input) => {
            input.addEventListener("midimessage", handleMidiInput);
          });
        },
        (fail) => {
          console.log(`Could not connect to MIDI. Error: ${fail}`);
        }
      );
    }
  }, []);

  function findMidiDevices(e) {
    if (e.port.state === "disconnected") {
      setMidiDeviceName("No device detected");
    } else if (e.port.state === "connected") {
      setMidiDeviceName(e.port.name);
    }
  }

  function handleMidiInput(e) {
    setMidiCC(e.data[1]);
    setMidiValue(e.data[2]);
    midiToFreq = e.data[2] * midiIncrement;
  }

  function handleMidiClick() {
    setUseMidi((prev) => (prev = !prev));
  }

  function controlBarKeyDown(e) {
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
      <div className="midi-and-accessibility">
        <div
          className="midi"
          style={{ border: !useMidi && "1px solid rgba(165, 165, 165, 0)" }}
        >
          <img
            src="icons/midi-port.svg"
            className="link-icons"
            alt="MIDI"
            title="MIDI"
            onClick={handleMidiClick}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleMidiClick();
              }
            }}
            style={{
              filter:
                useMidi &&
                "invert(75%) sepia(61%) saturate(411%) \
                hue-rotate(353deg) brightness(101%) contrast(101%)",
              cursor: "pointer",
            }}
          />
          <p style={{ display: !useMidi && "none" }}>
            {safariAgent
              ? "Safari does not support Web MIDI."
              : `MIDI: ${midiDeviceName} | CC#: ${midiCC} | Value: ${
                  midiValue === undefined ? 0 : midiValue
                }`}
          </p>
        </div>
        <img
          src="icons/universal-access-solid.svg"
          alt="Universal Access"
          title="Universal Access"
          className="link-icons"
          onClick={handleModal}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setIsVisible(true);
            }
            if (e.key === "Escape") {
              setIsVisible(false);
            }
          }}
          style={{ cursor: "pointer" }}
        />
      </div>
      <div className="plugin-container-freqy">
        <h1>FREQY</h1>
        <DragDrop uploadedAudio={setUploadedAudio} />
        <div className="plugin-drag-drop" style={{ marginTop: "25px" }}>
          <div className="plugin-control-bar">
            <div className="plugin-control-bar-L-freqy">
              <fieldset>
                <legend>Mode {">>"}</legend>
                <div title="Lowpass filter" style={{marginBottom: "3px"}}>
                  <input
                    type="radio"
                    id="lp"
                    name="mode"
                    value="0"
                    onClick={handleClick}
                    defaultChecked
                  />
                  <label htmlFor="lp">Classic</label>
                  <img
                    src="icons/filter-lowpass.svg"
                    className="filter-icons"
                    style={{marginLeft: "14px"}}
                  />
                </div>
                <div title="Highpass filter" style={{marginBottom: "3px"}}>
                  <input
                    type="radio"
                    id="hp"
                    name="mode"
                    value="1"
                    onClick={handleClick}
                  />
                  <label htmlFor="hp">DJ Booth</label>
                  <img
                    src="icons/filter-lowpass.svg"
                    className="filter-icons flip-hztl"
                  />
                </div>
                <div title="Bandpass filter" style={{marginBottom: "3px"}}>
                  <input
                    type="radio"
                    id="bp"
                    name="mode"
                    value="2"
                    onClick={handleClick}
                  />
                  <label htmlFor="bp">Trip-Hop</label>
                  <img
                    src="icons/filter-notch.svg"
                    className="filter-icons flip-vrtl"
                  />
                </div>
                <div title="Notch filter">
                  <input
                    type="radio"
                    id="nc"
                    name="mode"
                    value="3"
                    onClick={handleClick}
                  />
                  <label htmlFor="nc">Nu-Skool</label>
                  <img
                    src="icons/filter-notch.svg"
                    className="filter-icons"
                    style={{marginLeft: "9px"}}
                  />
                </div>
              </fieldset>
            </div>
            <div className="plugin-control-bar-R">
              <div id="play-btn">
                <img
                  src="icons/play-solid.svg"
                  alt="Play"
                  title="Play"
                  id="play-1"
                  className="plugin-control-buttons"
                  onClick={playSample}
                  tabIndex={0}
                  onKeyDown={controlBarKeyDown}
                />
              </div>
              <div id="stop-btn">
                <img
                  src="icons/stop-solid.svg"
                  alt="Stop"
                  title="Stop"
                  id="stop-1"
                  className="plugin-control-buttons"
                  onClick={stopSample}
                  tabIndex={0}
                  onKeyDown={controlBarKeyDown}
                />
              </div>
              <div id="loop-btn">
                <img
                  src="icons/repeat-solid.svg"
                  alt="Loop"
                  title="Loop"
                  id="loop-1"
                  className="plugin-control-buttons"
                  onClick={loopSample}
                  tabIndex={0}
                  onKeyDown={controlBarKeyDown}
                />
              </div>
            </div>
          </div>
        </div>
        <Knob setFiltFreq={setFreq} midiFreq={midiToFreq} />
      </div>
    </>
  );
}
