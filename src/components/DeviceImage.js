import React from "react";
import { useDrag } from "react-dnd";

const DeviceImage = ({ url, id }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    item: { id, url },
    collect: (monitor) => ({
      // this is to keep track if an element is being dragged
      isDragging: monitor.isDragging(),
    }),
  }));
  return (
    <img
      ref={drag}
      style={{
        margin: "10px",
        cursor: "pointer",
      }}
      src={url}
      alt="device"
    />
  );
};

export default DeviceImage;
