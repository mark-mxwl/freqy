import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["wav", "aiff", "mp3"];

function DragDrop() {
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
  };

  console.log(file);

  return (
    <>
    <div className="plugin-drag-drop">
    <FileUploader
      handleChange={handleChange}
      name="file"
      types={fileTypes}
      multiple={false}
      label="Upload your audio here!"
      array={["wav", "aiff", "mp3"]}
      maxSize={10}
      onSizeError={(file) => console.log(file)}
      //   children={
      //     <div>
      //       <p style={{ textAlign: "center" }}>this working?</p>
      //     </div>
      //   }
    />
    </div>
    </>
  );
}

export default DragDrop;
