import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import GrabBag from "./components/GrabBag";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <GrabBag />
    </DndProvider>
  );
}

export default App;
