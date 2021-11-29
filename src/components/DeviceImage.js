import React from "react";
import { useDrag } from "react-dnd";

const DeviceImage = ({ url, id, setBagItems, bagItems }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    item: { id, url },
    collect: (monitor) => ({
      // this is to keep track if an element is being dragged
      isDragging: monitor.isDragging(),
    }),
  }));

  const addBagItem = (itemId, itemUrl) => {
    setBagItems((bag) =>
      !bag.some((el) => el.id === itemId)
        ? [...bag, { id: itemId, url: itemUrl }]
        : bag
    );
  };

  return (
    <div className="flex flex-col items-center">
      <img
        ref={drag}
        className={`my-2 mx-3 rounded-xl cursor-pointer ${
          isDragging
            ? bagItems.some((el) => el.id === id)
              ? "border-solid border-4 border-red-600"
              : "border-solid border-4 border-green-400"
            : "border-solid border-4 border-transparent"
        }`}
        src={url}
        alt="device"
      />
      <button
        onClick={() => addBagItem(id, url)}
        className="xl:hidden bg-gray-200 w-11/12 hover:bg-green-400 transition ease-in-out delay-25 rounded-md text-3xl font-bold text-green-700"
      >
        +
      </button>
    </div>
  );
};

export default DeviceImage;
