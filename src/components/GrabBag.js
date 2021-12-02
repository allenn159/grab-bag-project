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

  useEffect(() => {
    const data = localStorage.getItem("bagItems");
    if (data) {
      setBagItems(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bagItems", JSON.stringify(bagItems));
  }, [bagItems]);

  if (!devices.length) return <p className="text-center">Loading...</p>;

  return (
    <>
      <div className="flex flex-col items-center bg-blue-300 sticky top-0">
        <p className="text-2xl font-bold">Items: {bagItems?.length}</p>

        <div
          ref={drop}
          className={`whitespace-nowrap text-center w-11/12 h-80 mb-4 rounded-lg bg-white shadow-xl overflow-x-auto ${
            isOver && "bg-gray-100"
          }`}
        >
          {bagItems.map((device) => (
            <div className="inline-block" key={device.id}>
              <img className="mt-6 mx-3 rounded-md" src={device.url} />
              <button
                onClick={() => handleRemoveBagItem(device.id)}
                className="w-11/12 h-10 mt-2 bg-gray-200 xl:hover:bg-red-400 transition ease-in-out delay-25 rounded-md text-2xl font-bold text-red-700"
              >
                X
              </button>
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
              setBagItems={setBagItems}
              bagItems={bagItems}
            />
          ))}
      </InfiniteScroll>
    </>
  );
};

export default GrabBag;
