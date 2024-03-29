import { useRef, useState, useEffect } from "react";

export default function Knob(props) {
  const { setFiltFreq, midiFreq } = props;
  
  const componentIsMounted = useRef(false);

  const knobRef = useRef();
  const pointerRef = useRef();
  const currentValueRef = useRef(5000);
  const [keyInput, setKeyInput] = useState("");

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
      currentValueRef.current = distance + 5000;
    }
  }, [midiFreq]);

  useEffect(() => {
    if (keyInput) {
      distance = freqClamp(keyInput - 5000, 5000, -4900);
      setFiltFreq(distance + 5000);
      knobRef.current.style.transform = "rotate(" + distance / 32 + "deg)";
      currentValueRef.current = distance + 5000;
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
    ["mousedown", "touchstart"].forEach((e) =>
      knobRef.current.addEventListener(e, (e) => {
        e.preventDefault();
        e.type === "mousedown" && (center = e.pageY);
        e.type === "touchstart" && (center = e.changedTouches[0].screenY);
        mouseIsDown = true;
      })
    );

    ["mouseup", "touchend"].forEach((e) =>
      document.body.addEventListener(e, (e) => {
        mouseIsDown = false;
      })
    );

    knobRef.current.addEventListener("mouseenter", (e) => {
      if (mouseIsDown) {
        mouseIsMoving = true;
      }
    });

    document.body.addEventListener("touchmove", (e) => {
      mouseIsMoving = true;
      if (mouseIsDown && mouseIsMoving) {
        distance = freqClamp(
          (center - e.changedTouches[0].screenY) * 38, 5000, -4900);
        knobRef.current.style.transform = "rotate(" + distance / 32 + "deg)";
        currentValueRef.current = distance + 5000;
        setFiltFreq(distance + 5000);
      }
    });

    document.body.addEventListener("mousemove", (e) => {
      mouseIsMoving = true;
      if (mouseIsDown && mouseIsMoving) {
        distance = freqClamp((center - e.pageY) * 38, 5000, -4900);
        knobRef.current.style.transform = "rotate(" + distance / 32 + "deg)";
        currentValueRef.current = distance + 5000;
        setFiltFreq(distance + 5000);
      }
    });

    knobRef.current.addEventListener("dblclick", (e) => {
      knobRef.current.style.transform = "rotate(0deg)";
      currentValueRef.current = 5000;
      setFiltFreq(5000);
      setKeyInput("");
    });

    ["dblclick", "keydown"].forEach((e) =>
      currentValueRef.current.addEventListener(e, (e) => {
        if (e.key === "Enter" || e.type === "dblclick") {
          knobRef.current.style.transform = "rotate(0deg)";
          currentValueRef.current = 5000;
          setFiltFreq(5000);
          setKeyInput("");
        }
      })
    );

    currentValueRef.current.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
      }
    });
  }

  return (
    <>
      <div className="wrapper">
        <div className="knob">
          <div className="label label-l-freqy">100 Hz</div>
          <div className="knob_inner_shadow">
            <div
              ref={knobRef}
              className="knob_inner_freqy"
              title="Cutoff: double-click to reset! (MIDI CC# ANY)"
            >
              <div ref={pointerRef} className="knob_inner_pointer_freqy"></div>
            </div>
          </div>
          <div className="label label-r-freqy">10 KHz</div>
        </div>
        <div
          title="Frequency: double-click to reset!"
          ref={currentValueRef}
          className="current-value"
          tabIndex={0}
          onKeyDown={handleKeyInput}
        >
          <div>
            {keyInput
              ? `${freqClamp(keyInput, 10000, 100).toFixed(0)}Hz`
              : `${currentValueRef.current.toFixed(0)}Hz`}
          </div>
        </div>
      </div>
    </>
  );
}
