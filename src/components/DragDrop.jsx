import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["wav", "aiff", "mp3"];

function DragDrop() {
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
  };

  // console.log(file?.name);

  return (
    <>
      <div className="plugin-drag-drop">
        <FileUploader
          handleChange={handleChange}
          name={file?.name}
          types={fileTypes}
          multiple={false}
          label="Upload your audio here!"
          array={["wav", "aiff", "mp3"]}
          maxSize={10}
          onSizeError={(file) => console.log(file)}
        />
      </div>
    </>
  );
}

export default DragDrop;
