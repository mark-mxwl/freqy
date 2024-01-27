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
  const [uploadedAudio, setUploadedAudio] = useState(null);
  
  // SET FILTER PROPERTIES
  filter.type = "notch";
  filter.Q.value = 0.7;
  filter.frequency.value = freq;

  useEffect(() => {
    if (uploadedAudio && !isPlaying) {
      // DECODE UPLOADED AUDIO & CREATE BUFFER
      var reader1 = new FileReader();
      reader1.readAsArrayBuffer(uploadedAudio);
      reader1.onload = function (ev) {
        ctx.decodeAudioData(ev.target.result).then(function (buffer) {
          var soundSource = ctx.createBufferSource();
          soundSource.buffer = buffer;
          soundSource.connect(filter);
          playBufferedSample = () => soundSource.start();
          stopBufferedSample = () => soundSource.stop();
          bufferLength = Number(soundSource.buffer.duration.toFixed(0) * 1000);
          console.log("buffer created!");
        });
      };
      
    }
  }, [uploadedAudio, isPlaying]);

  // PLAY, STOP, & LOOP BUFFERED AUDIO
  function playSample() {
    ctx.resume();
    setIsPlaying(true);
    playBufferedSample();
    setTimeout(suspendContext, bufferLength);
  }

  function stopSample() {
    stopBufferedSample();
    setIsPlaying(false);
    console.log("stopped");
  }

  function loopSample() {
    console.log("looping");
  }

  // SUSPEND AUDIO CONTEXT
  function suspendContext() {
    ctx.suspend();
    setIsPlaying(false);
  }

  return (
    <>
      <div className="plugin-container">
        <h1>NOTCHIE</h1>
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
    </>
  );
}
