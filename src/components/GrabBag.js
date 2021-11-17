import React, { useState, useEffect } from "react";
import axios from "axios";
import DeviceImage from "./DeviceImage";
import { useDrop } from "react-dnd";

const GrabBag = () => {
  const [devices, setDevices] = useState(null);
  const [bagItems, setBagItems] = useState([]);
  const [offset, setOffSet] = useState(7);
  const [limit, setLimit] = useState(50);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "image",
    drop: (item) =>
      setBagItems((bag) =>
        !bag.some((el) => el.id === item.id)
          ? [...bag, { id: item.id, url: item.url }]
          : bag
      ),
    collect: (monitor) => ({
      // this is to keep track if an element is being dragged
      isOver: monitor.isOver(),
    }),
  }));

  async function getDevices() {
    const { data } = await axios.get(
      `https://www.ifixit.com/api/2.0/wikis/CATEGORY?offset=${offset}&limit=${limit}`
    );
    setDevices(data);
  }

  useEffect(() => {
    getDevices();
  }, []);

  if (!devices) return <p>Loading...</p>;

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>Grab Bag Project</h1>
        <div
          ref={drop}
          style={{
            height: "300px",
            width: "90%",
            border: "5px solid red",
            marginBottom: "30px",
            display: "flex",
          }}
        >
          {bagItems.map((device) => (
            <DeviceImage key={device.id} url={device.url} id={device.id} />
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {devices?.map((device) => (
          <DeviceImage
            key={device.wikiid}
            url={device.image.standard}
            id={device.wikiid}
          />
        ))}
      </div>
    </>
  );
};

export default GrabBag;
