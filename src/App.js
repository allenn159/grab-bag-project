import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [devices, setDevices] = useState(null);
  const [bagItems, setBagItems] = useState(null);
  const [offset, setOffSet] = useState(7);
  const [limit, setLimit] = useState(50);

  async function getDevices() {
    const { data } = await axios.get(
      `https://www.ifixit.com/api/2.0/wikis/CATEGORY?offset=${offset}&limit=${limit}`
    );
    setDevices(data);
  }

  useEffect(() => {
    getDevices();
  }, []);

  console.log(devices);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Grab Bag Project</h1>
      <div
        style={{
          height: "300px",
          width: "90%",
          border: "5px solid red",
          marginBottom: "30px",
        }}
      ></div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {devices?.map((device) => (
          <img
            style={{ padding: "0 20px" }}
            key={device.wikiid}
            src={device.image.standard}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
