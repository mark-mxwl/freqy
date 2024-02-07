function InfoModal(props) {

  const { isVisible, toggleModal } = props;

  return (
    <div
      className="modal-container"
      style={{ visibility: `${isVisible ? "visible" : "hidden"}` }}
      tabIndex={0}
      onKeyDown={toggleModal}
    >
      <div 
        onClick={toggleModal} 
        className="modal-x" 
        tabIndex={0} 
        onKeyDown={toggleModal}>
        X
      </div>
      <h2>FREQY Keyboard Navigation</h2>
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
        Use ARROW ↑/↓ to select filter type.
      </p>
      <p>
        BUTTONS {">> "}
        Press ENTER to play, stop, or loop.
      </p>
      <p>
        CUTOFF {">> "}
        Enter a value between 100 and 10K, or use ARROW ↑/↓ to
        rotate knob. Press ENTER to reset.
      </p>
    </div>
  );
}

export default InfoModal;
