import { useState, useEffect, useRef } from "react";
import Knob from "./components/Knob.jsx";
import DragDrop from "./components/DragDrop.jsx";

export default function App() {
  return (
    <>
      <div className="plugin-container">
        <h1>NOTCHIE</h1>
        <DragDrop />
        <Knob />
      </div>
    </>
  );
}
