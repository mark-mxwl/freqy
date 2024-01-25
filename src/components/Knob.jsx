import { useRef, useEffect, useState } from "react";

export default function Knob(props) {
  const componentIsMounted = useRef(false);

  const knobRef = useRef();
  const pointerRef = useRef();
  const currentValueRef = useRef();

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

    knobRef.current.addEventListener("mouseup", (e) => {
      mouseIsDown = false;
    });

    knobRef.current.addEventListener("mouseenter", (e) => {
      if (mouseIsDown) {
        mouseIsMoving = true;
      }
    });

    document.body.addEventListener("mousemove", (e) => {
      mouseIsMoving = true;
      let divisor = 5;
      let multiplier = 3;
      if (mouseIsDown && mouseIsMoving) {
        if (e.pageY < center) {
          multiplier = 21;
          divisor = 42;
        }
        distance = freqClamp((center - e.pageY) * multiplier, 7000, -800);
        knobRef.current.style.transform =
          "rotate(" + distance / divisor + "deg)";
        currentValueRef.current.innerHTML = distance + 1000 + "Hz";
        props.freq(distance + 1000);
      }
    });

    knobRef.current.addEventListener("dblclick", (e) => {
      mouseIsDown = false;
      knobRef.current.style.transform = "rotate(0deg)";
      currentValueRef.current.innerHTML = "1000Hz";
    });
  }

  return (
    <>
      <div className="wrapper">
        <div className="knob">
          <div className="label label-l">200 Hz</div>
          <div ref={knobRef} className="knob_inner">
            <div ref={pointerRef} className="knob_inner_pointer"></div>
          </div>
          <div className="label label-r">8 KHz</div>
        </div>
        <div ref={currentValueRef} className="current-value">
          1000Hz
        </div>
        <div className="instructions">Double click knob to reset</div>
      </div>
    </>
  );
}
