import { useState, useEffect } from "react";
import Knob from "./components/Knob.jsx";
import DragDrop from "./components/DragDrop.jsx";

export default function App() {
  // CREATE AUDIO CONTEXT & SOURCE
  const [ctx, setCtx] = useState(new AudioContext());
  const sample = new Audio("src/assets/audio/vox_stab_w_verb.wav");
  const source = ctx.createMediaElementSource(sample);
  ctx.onstatechange = () => console.log(ctx.state, ctx.currentTime);

  useEffect(() => {
    setCtx(new AudioContext());
  }, []);

  // CREATE FILTER & SET PROPERTIES
  const filter = ctx.createBiquadFilter();
  const [freq, setFreq] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);

  filter.type = "notch";
  filter.frequency.value = freq;
  // console.log(freq)

  // SET SIGNAL PATH: SOURCE -> FILTER -> OUTPUT
  source.connect(filter);
  filter.connect(ctx.destination);

  // SUSPEND AUDIO CONTEXT
  function suspendContext() {
    setIsPlaying(false);
    ctx.suspend();
  }

  // TRIGGER AUDIO SAMPLE
  function playSound() {
    ctx.resume();
    setIsPlaying(true);
    !isPlaying && sample.play();
    const sampleDurationInMs = Number(sample.duration.toFixed(0) * 1000);
    setTimeout(suspendContext, sampleDurationInMs);
  }

  return (
    <>
      <div className="plugin-container">
        <h1>NOTCHIE</h1>
        <DragDrop />
        <div className="plugin-drag-drop" style={{ marginTop: "25px" }}>
          <button onClick={playSound} id="play-btn">
            PREVIEW AUDIO
          </button>
        </div>
        <Knob freq={setFreq} />
      </div>
    </>
  );
}
