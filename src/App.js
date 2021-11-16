import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [devices, setDevices] = useState(null);
  return (
    <div>
      <h1>Grab Bag Project</h1>
      <div
        style={{ height: "300px", width: "900px", border: "5px solid red" }}
      ></div>
      <div></div>
    </div>
  );
}

export default App;
