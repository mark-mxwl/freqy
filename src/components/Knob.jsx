import { useRef, useState, useEffect } from "react";

export default function Knob(props) {
  const componentIsMounted = useRef(false);

  const knobRef = useRef();
  const pointerRef = useRef();
  const currentValueRef = useRef();
  const [keyInput, setKeyInput] = useState("");

  const { setFiltFreq, midiFreq } = props;

  let center = 0;
  let distance;
  let mouseIsDown = false;
  let mouseIsMoving = false;

  useEffect(() => {
    componentIsMounted.current = true;
    componentIsMounted.current && mountKnob();

    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (midiFreq) {
      distance = freqClamp(midiFreq - 5000, 5000, -4900);
      setFiltFreq(distance + 5000);
      knobRef.current.style.transform = "rotate(" + distance / 32 + "deg)";
      currentValueRef.current.innerHTML = distance + 5000 + "Hz";
    }
  }, [midiFreq]);

  useEffect(() => {
    if (keyInput) {
      distance = freqClamp(keyInput - 5000, 5000, -4900);
      setFiltFreq(distance + 5000);
      knobRef.current.style.transform = "rotate(" + distance / 32 + "deg)";
      currentValueRef.current.innerHTML = distance + 5000 + "Hz";
    }
  }, [keyInput]);

  function handleKeyInput(e) {
    
    // For typed values
    const isNumber = isFinite(e.key);
    if (isNumber) {
      setKeyInput((prev) => Number(prev + e.key));
    }

    // For arrow values
    let arrowIncrement = 180;
    if (e.key === "ArrowUp") {
      setKeyInput((prev) => Number(prev + arrowIncrement));
    }
    if (e.key === "ArrowDown") {
      setKeyInput((prev) => Number(prev - arrowIncrement));
    } 
  }

  function freqClamp(value, max, min) {
    if (value > max) return max;
    if (value < min) return min;
    return value;
  }

  function mountKnob() {
    knobRef.current.addEventListener("mousedown", (e) => {
      center = e.pageY;
      mouseIsDown = true;
    });

    document.body.addEventListener("mouseup", (e) => {
      mouseIsDown = false;
    });

    knobRef.current.addEventListener("mouseenter", (e) => {
      if (mouseIsDown) {
        mouseIsMoving = true;
      }
    });

    document.body.addEventListener("mousemove", (e) => {
      mouseIsMoving = true;
      if (mouseIsDown && mouseIsMoving) {
        distance = freqClamp((center - e.pageY) * 38, 5000, -4900);
        knobRef.current.style.transform =
          "rotate(" + distance / 32 + "deg)";
        currentValueRef.current.innerHTML = distance + 5000 + "Hz";
        setFiltFreq(distance + 5000);
      }
    });

    knobRef.current.addEventListener("dblclick", (e) => {
      knobRef.current.style.transform = "rotate(0deg)";
      currentValueRef.current.innerHTML = "5000Hz";
      setKeyInput("");
    });

    currentValueRef.current.addEventListener("dblclick", (e) => {
      knobRef.current.style.transform = "rotate(0deg)";
      currentValueRef.current.innerHTML = "5000Hz";
      setKeyInput("");
    });

    currentValueRef.current.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        knobRef.current.style.transform = "rotate(0deg)";
        currentValueRef.current.innerHTML = "5000Hz";
        setKeyInput("");
      }
    });
  }

  return (
    <>
      <div className="wrapper">
        <div className="knob">
          <div className="label label-l">100 Hz</div>
          <div className="knob_inner_shadow">
            <div
              ref={knobRef}
              className="knob_inner"
              title="Cutoff: double-click to reset!"
            >
              <div ref={pointerRef} className="knob_inner_pointer"></div>
            </div>
          </div>
          <div className="label label-r">10 KHz</div>
        </div>
        <div
          title="Frequency: double-click to reset!"
          ref={currentValueRef}
          className="current-value"
          tabIndex={0}
          onKeyDown={handleKeyInput}
        >
          {keyInput ? `${freqClamp(keyInput, 10000, 100)}Hz` : "5000Hz"}
        </div>
      </div>
    </>
  );
}
