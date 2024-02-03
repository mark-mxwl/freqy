function InfoModal(props) {

  return (
    <div
      className="modal-container"
      style={{ visibility: `${props.isVisible ? "visible" : "hidden"}` }}
    >
      <div onClick={props.toggleModal} className="modal-x">
        X
      </div>
      <h2>FREQY Keyboard Navigation (Windows/Mac)</h2>
      <p>
        GLOBAL {">> "}
        To navigate forward, press TAB. To navigate backward, press SHIFT+TAB.
      </p>
      <p>
        FILE SELECTOR {">> "}
        Press any key to select an audio file from your device.
      </p>
      <p>
        MODE {">> "}
        Use Arrow-Up / Arrow-Down keys to select filter type.
      </p>
      <p>
        BUTTONS {">> "}
        Press ENTER to play, stop, or loop uploaded audio.
      </p>
      <p>
        FREQUENCY {">> "}
        Enter a value between 100 and 10K, or use Arrow-Up / Arrow-Down keys to
        rotate cutoff knob. Press ENTER to reset.
      </p>
    </div>
  );
}

export default InfoModal;
