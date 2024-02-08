import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["wav", "aiff", "mp3"];

function DragDrop(props) {
  const [audioFile, setAudioFile] = useState(null);
  const handleChange = (file) => {
    setAudioFile(file);
    props.uploadedAudio(file);
  };
  const [sizeErrorText, setSizeErrorText] = useState("")
  const fileSizeTooBig = () => setSizeErrorText("File size exceeds 10MB!");
  const fileNameWithSpaces = audioFile?.name.split("_").join(" ");

  const styles = {
    width: "60vw",
    minWidth: "275px",
    maxWidth: "500px",
    height: "75px",
    margin: "-5px auto 0 auto",
    padding: ".01em 15px 1rem 15px",
    border: "none",
    borderRadius: "20px",
    backgroundColor: "#242424",
    color: "rgba(255, 255, 255, 0.9)",
    font: ".95rem Inconsolata, monospace",
    cursor: "pointer",
    userSelect: "none",
  };

  return (
    <>
      <div title="File selector" className="plugin-drag-drop">
        <FileUploader
          handleChange={handleChange}
          name={audioFile?.name}
          types={fileTypes}
          multiple={false}
          label="Drop or select audio!"
          children={
            audioFile ? (
              <div style={styles}>
                <p>
                  <b>{fileNameWithSpaces}</b> uploaded successfully!
                </p>
                <p>
                  {">>"} Drop or <u>select</u> audio to replace!
                </p>
              </div>
            ) : (
              <div style={styles}>
                <p>
                  {">>"} <b>Drop</b> or <u>select</u> audio // 10MB limit
                </p>
                <p>
                  {sizeErrorText}
                </p>
              </div>
            )
          }
          array={["wav", "aiff", "mp3"]}
          maxSize={10}
          onSizeError={fileSizeTooBig}
        />
      </div>
    </>
  );
}

export default DragDrop;
