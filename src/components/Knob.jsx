import { useRef, useEffect } from "react";

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
          <div className="label label-l">100 Hz</div>
          <div className="knob_inner_shadow">
            <div
              ref={knobRef}
              className="knob_inner"
              title="Double-click to reset!"
            >
              <div ref={pointerRef} className="knob_inner_pointer"></div>
            </div>
          </div>
          <div className="label label-r">10 KHz</div>
        </div>
        <div ref={currentValueRef} className="current-value">
          1000Hz
        </div>
      </div>
    </>
  );
}
