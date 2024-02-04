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
      distance = freqClamp(midiFreq - 1000, 9000, -900);
      setFiltFreq(distance + 1000);
      if (midiFreq <= 1000) {
        knobRef.current.style.transform = "rotate(" + distance / 5.5 + "deg)";
      }
      if (midiFreq > 1000) {
        knobRef.current.style.transform = "rotate(" + distance / 55 + "deg)";
      }
      currentValueRef.current.innerHTML = distance + 1000 + "Hz";
    }
  }, [midiFreq]);

  useEffect(() => {
    if (keyInput) {
      distance = freqClamp(keyInput - 1000, 9000, -900);
      setFiltFreq(distance + 1000);
      if (keyInput <= 1000) {
        knobRef.current.style.transform = "rotate(" + distance / 5.5 + "deg)";
      }
      if (keyInput > 1000) {
        knobRef.current.style.transform = "rotate(" + distance / 55 + "deg)";
      }
    }
  }, [keyInput]);

  function handleKeyInput(e) {
    const isNumber = isFinite(e.key);
    if (isNumber) {
      setKeyInput((prev) => Number(prev + e.key));
    }
    if (keyInput && e.key === "ArrowUp") {
      setKeyInput((prev) => (prev * 1.1).toFixed(0));
    }
    if (keyInput && e.key === "ArrowDown") {
      setKeyInput((prev) => (prev / 1.1).toFixed(0));
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
      let divisor = 5.5;
      let multiplier = 6;
      if (mouseIsDown && mouseIsMoving) {
        if (e.pageY < center) {
          multiplier = 50;
          divisor = 55;
        }
        distance = freqClamp((center - e.pageY) * multiplier, 9000, -900);
        knobRef.current.style.transform =
          "rotate(" + distance / divisor + "deg)";
        currentValueRef.current.innerHTML = distance + 1000 + "Hz";
        setFiltFreq(distance + 1000);
      }
    });

    knobRef.current.addEventListener("dblclick", (e) => {
      knobRef.current.style.transform = "rotate(0deg)";
      currentValueRef.current.innerHTML = "1000Hz";
      setKeyInput("");
    });

    currentValueRef.current.addEventListener("dblclick", (e) => {
      knobRef.current.style.transform = "rotate(0deg)";
      currentValueRef.current.innerHTML = "1000Hz";
      setKeyInput("");
    });

    currentValueRef.current.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        knobRef.current.style.transform = "rotate(0deg)";
        currentValueRef.current.innerHTML = "1000Hz";
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
          {keyInput ? `${freqClamp(keyInput, 10000, 100)}Hz` : "1000Hz"}
        </div>
      </div>
    </>
  );
}
