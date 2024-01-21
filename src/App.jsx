import { useState, useEffect } from "react";
import Knob from "./components/Knob.jsx";
import DragDrop from "./components/DragDrop.jsx";

export default function App() {
  
  // CREATE AUDIO CONTEXT & SOURCE
  const cxt = new AudioContext();
  const sample = new Audio("src/assets/audio/vox_stab_w_verb.wav");
  const source = cxt.createMediaElementSource(sample);
  cxt.onstatechange = () => console.log(cxt.state)

  // CREATE FILTER & SET PROPERTIES
  const filter = cxt.createBiquadFilter();
  const [freq, setFreq] = useState(7000)
  filter.type = "notch"
  filter.frequency.value = freq
  console.log(filter.frequency.value)

  // SET SIGNAL PATH: SOURCE -> FILTER -> OUTPUT
  source.connect(filter);
  filter.connect(cxt.destination);

  // TRIGGER SAMPLE
  function playSound() {
    sample.play();
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
        <Knob 
          freq={setFreq}
        />
      </div>
    </>
  );
}
