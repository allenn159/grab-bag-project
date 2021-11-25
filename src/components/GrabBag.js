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
        !bag.some((el) => el.id === item.id) && bag.length < 5
          ? [...bag, { id: item.id, url: item.url }]
          : bag
      ),
    collect: (monitor) => ({
      // this is to keep track if an element is being dragged
      isOver: monitor.isOver(),
    }),
  }));

  const handleUpdatePage = () => setOffSet((prev) => prev + 20);

  const handleRemoveBagItem = (deviceId) => {
    const updatedBag = bagItems.filter((bagItem) => bagItem.id !== deviceId);
    setBagItems(updatedBag);
  };

  async function getDevices() {
    const { data, headers } = await axios.get(
      `https://www.ifixit.com/api/2.0/wikis/CATEGORY?offset=${offset}&limit=20`
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

  // useEffect(() => {
  //   const data = localStorage.getItem("bagItems");
  //   if (data) {
  //     setBagItems(JSON.parse(data));
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("bagItems", JSON.stringify(bagItems));
  // }, [bagItems]);

  if (!devices.length) return <p>Loading...</p>;

  return (
    // Styling is just a placeholder for now.
    <>
      <div className="flex flex-col items-center bg-blue-300 sticky top-0">
        <p className="text-5xl font-bold my-4 font-sans">
          Grab <span className="text-purple-700">Bag</span>
        </p>
        <p
          className={`text-4xl font-bold ${
            bagItems?.length === 5 ? "text-red-700" : "text-current"
          }`}
        >{`${bagItems?.length} / 5`}</p>

        <div
          ref={drop}
          className={`flex flex-col lg:flex-row flex-wrap lg:justify-center items-center ${
            bagItems.length === 0 ? "h-64" : "h-auto"
          } w-11/12 mb-4 rounded-lg bg-white shadow-xl`}
        >
          {bagItems.map((device) => (
            <div className="relative" key={device.id}>
              <button
                onClick={() => handleRemoveBagItem(device.id)}
                className="absolute top-5 right-4 w-8 bg-gray-200 hover:bg-red-400 transition ease-in-out delay-25 rounded-md text-3xl font-bold text-red-700"
              >
                X
              </button>
              <img className="my-4 mx-3 rounded-md" src={device.url} />
            </div>
          ))}
        </div>
      </div>
      <InfiniteScroll
        className="flex flex-wrap justify-center"
        dataLength={devices.length}
        next={handleUpdatePage}
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
