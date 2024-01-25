import React, { useState, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["wav", "aiff", "mp3"];

function DragDrop(props) {
  const [audioFile, setAudioFile] = useState(null);
  const handleChange = (file) => {
    setAudioFile(file);
    props.uploadedAudio(file)
  };

  return (
    <>
      <div className="plugin-drag-drop">
        <FileUploader
          handleChange={handleChange}
          name={audioFile?.name}
          types={fileTypes}
          multiple={false}
          label="Drop or select audio!"
          children={audioFile && `${audioFile.name} uploaded successfully!`}
          array={["wav", "aiff", "mp3"]}
          maxSize={10}
          onSizeError={(file) => console.log(file)}
        />
      </div>
    </>
  );
}

export default DragDrop;
