import React, { useState, useEffect } from "react";
import axios from "axios";
import DeviceImage from "./DeviceImage";
import { useDrop } from "react-dnd";
import InfiniteScroll from "react-infinite-scroll-component";

const GrabBag = () => {
  const [devices, setDevices] = useState([]);
  const [bagItems, setBagItems] = useState([]);
  const [offset, setOffSet] = useState(7);
  const [hasMore, setHasMore] = useState(true);

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

  const updatePage = () => {
    setOffSet((prev) => prev + 50);
  };

  async function getDevices() {
    const { data, headers } = await axios.get(
      `https://www.ifixit.com/api/2.0/wikis/CATEGORY?offset=${offset}&limit=50`
    );
    // setDevices((prev) => [...prev, ...data]);
    setDevices((prev) => [...prev, ...data]);
    if (headers["content-length"] <= offset) {
      setHasMore(false);
    }
  }

  useEffect(() => {
    getDevices();
  }, [offset]);

  if (!devices.length) return <p>Loading...</p>;

  return (
    // Styling is just a placeholder for now.
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "sticky",
          top: 0,
        }}
      >
        <h2>Grab Bag Project</h2>
        <div
          ref={drop}
          style={{
            height: "250px",
            width: "90%",
            border: "5px solid red",
            marginBottom: "30px",
            display: "flex",
            paddingLeft: "100px",
          }}
        >
          {bagItems.map((device) => (
            <DeviceImage key={device.id} url={device.url} id={device.id} />
          ))}
        </div>
      </div>
      <InfiniteScroll
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
        dataLength={devices.length}
        next={updatePage}
        hasMore={hasMore}
      >
        {devices.length &&
          devices.map((device) => (
            <DeviceImage
              key={device.wikiid}
              url={device.image.standard}
              id={device.wikiid}
            />
          ))}
      </InfiniteScroll>
    </>
  );
};

export default GrabBag;
