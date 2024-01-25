import { useState, useEffect } from "react";
import Knob from "./components/Knob.jsx";
import DragDrop from "./components/DragDrop.jsx";

// CREATE AUDIO CONTEXT & FILTER
const ctx = new AudioContext();
const filter = ctx.createBiquadFilter();
filter.connect(ctx.destination);

// const dropFX = new Audio("src/assets/audio/FL_nav_active_click.wav");
// const fXsource = ctx.createMediaElementSource(dropFX);
// fXsource.connect(ctx.destination);

export default function App() {
  ctx.onstatechange = () => console.log(ctx.state, ctx.currentTime.toFixed(2));

  const [freq, setFreq] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadedAudio, setUploadedAudio] = useState(null);
  let bufferLength;
  let playBufferedSample;

  // SET FILTER PROPERTIES
  filter.type = "notch";
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
          bufferLength = Number(soundSource.buffer.duration.toFixed(0) * 1000);
        });
      };
    }
  }, [playSample]);

  // TRIGGER BUFFERED AUDIO
  function playSample() {
    ctx.resume();
    setIsPlaying(true);
    playBufferedSample();
    setTimeout(suspendContext, bufferLength);
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
          <button onClick={playSample} id="play-btn">
            PREVIEW AUDIO
          </button>
        </div>
        <Knob freq={setFreq} />
      </div>
    </>
  );
}
