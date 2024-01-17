import { useRef, useEffect } from "react";

export default function Knob() {
  const componentIsMounted = useRef(false);

  const knobRef = useRef();
  const pointerRef = useRef();
  const currentValueRef = useRef();

  let center = 0;
  let mouseIsDown = false;
  let distance;

  useEffect(() => {
    componentIsMounted.current = true;
    componentIsMounted.current && mountKnob();

    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  function clamp(value, max, min) {
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

    knobRef.current.addEventListener("dblclick", (e) => {
      mouseIsDown = false;
      knobRef.current.style.transform = "rotate(0deg)";
      currentValueRef.current.innerHTML = "0";
    });

    knobRef.current.addEventListener("mousemove", (e) => {
      if (mouseIsDown) {
        distance = clamp(center - e.pageY, 100, -100);
        knobRef.current.style.transform = "rotate(" + distance * 1.35 + "deg)";
        currentValueRef.current.innerHTML = distance;
      }
    });
  }

  return (
    <>
      <div className="wrapper">
        <div className="knob">
          <div className="label label-l">Do Less</div>
          <div ref={knobRef} className="knob_inner">
            <div ref={pointerRef} className="knob_inner_pointer"></div>
          </div>
          <div className="label label-r">Do More</div>
        </div>
        <div ref={currentValueRef} className="current-value">
          0
        </div>
        <div className="instructions">Double click to reset to 0</div>
      </div>
    </>
  );
}
