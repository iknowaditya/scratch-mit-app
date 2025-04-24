import React, { useState } from "react";
import {
  moveSprite,
  turnSprite,
  glideSprite,
} from "./SideBar/MotionSection/MotionSection";
import {
  hideSprite,
  showSprite,
  showMessageBubble,
} from "./SideBar/LooksSection/LookSection";
import Icon from "./Icon"; // Ensure you import the Icon component here as well
import QueueAction from "./actions";
import { useDispatch } from "react-redux";

const MidArea = () => {
  const [droppedElements, setDroppedElements] = useState([]);
  const dispatch = useDispatch();

  const handleDrop = (e) => {
    e.preventDefault();
    const actionType = e.dataTransfer.getData("actionType");
    const value = e.dataTransfer.getData("value");
    const originalSection = e.dataTransfer.getData("originalSection");
    const x = e.clientX - e.target.getBoundingClientRect().left;
    const y = e.clientY - e.target.getBoundingClientRect().top;

    if (originalSection !== "midArea") {
      setDroppedElements((prev) => [
        ...prev,
        { actionType, value, x, y, originalSection: "midArea" },
      ]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleElementClick = (actionType, value) => {
    if (actionType === "move") {
      moveSprite(value);
      dispatch(QueueAction("ENQUEUE", `move_right ${value}`));
    } else if (actionType === "turnLeft") {
      turnSprite(value, "left");
      dispatch(QueueAction("ENQUEUE", `turn_left ${value}`));
    } else if (actionType === "turnRight") {
      turnSprite(value, "right");
      dispatch(QueueAction("ENQUEUE", `turn_right ${value}`));
    } else if (actionType === "show") {
      showSprite();
      dispatch(QueueAction("ENQUEUE", `show`));
    } else if (actionType === "hide") {
      hideSprite();
      dispatch(QueueAction("ENQUEUE", `hide`));
    } else if (actionType === "glide") {
      glideSprite(Number(value));
      dispatch(QueueAction("ENQUEUE", `glide ${value}`));
    } else if (actionType === "say") {
      const arg = value.split("_");
      showMessageBubble(!Boolean(arg[1]), arg[0], Number(arg[2]), dispatch);
      dispatch(QueueAction("ENQUEUE", `say ${value}`));
    }
  };

  const handleInputChange = (e, index, elemIndex) => {
    const newValue = e.target.value;
    setDroppedElements((prev) =>
      prev.map((elem, i) =>
        i === elemIndex
          ? { ...elem, value: updateValueString(elem.value, index, newValue) }
          : elem
      )
    );
  };

  const updateValueString = (valueString, index, newValue) => {
    const values = valueString.split("_");
    values[index] = newValue;
    return values.join("_");
  };

  const renderInputElement = (elem, index, elemIndex) => {
    const allSplitArgs = elem.value.split("_");
    const value = elem.value.split("_")[index];
    if (elem.actionType === "say" && index === 0) {
      dispatch(QueueAction("SET_MESSAGE", value));
    }
    return (
      value !== "null" && (
        <div className="">
          <input
            value={value}
            onChange={(e) => handleInputChange(e, index, elemIndex)}
            onClick={(e) => e.stopPropagation()}
            className="text-black w-8 text-center mx-2 border border-white bg-white rounded-full"
          />
        </div>
      )
    );
  };

  const handleReset = () => {
    setDroppedElements([]);
  };

  const handleRun = () => {
    droppedElements.forEach((elem) => {
      handleElementClick(elem.actionType, elem.value);
    });
  };

  return (
    <div className="relative h-full w-full">
      <div
        className="absolute inset-0"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {droppedElements.map((elem, elemIndex) => (
          <div
            key={elemIndex}
            className={`${
              elem.actionType === "show" ||
              elem.actionType === "hide" ||
              elem.actionType === "say"
                ? "bg-purple-500"
                : "bg-blue-500"
            } flex flex-row flex-wrap text-white px-2 py-1 my-2 cursor-pointer rounded items-center text-xs`}
            style={{
              position: "absolute",
              top: elem.y,
              left: elem.x,
              width: "fit-content",
            }}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("actionType", elem.actionType);
              e.dataTransfer.setData("value", elem.value);
              e.dataTransfer.setData("originalSection", "midArea");
              e.dataTransfer.setData("index", elemIndex);
            }}
            onClick={() => handleElementClick(elem.actionType, elem.value)}
          >
            <span>{elem.actionType === "move" && "Move"}</span>
            <span>{elem.actionType === "turnLeft" && "Turn"}</span>
            <span>{elem.actionType === "turnRight" && "Turn"}</span>
            <span>{elem.actionType === "glide" && "Glide"}</span>
            <span>{elem.actionType === "show" && "Show"}</span>
            <span>{elem.actionType === "hide" && "Hide"}</span>
            <span>{elem.actionType === "say" && "Say"}</span>
            {elem.actionType.includes("turn") && (
              <Icon
                name={elem.actionType === "turnLeft" ? "undo" : "redo"}
                size={15}
                className="text-white mx-2 mt-1"
              />
            )}
            {renderInputElement(elem, 0, elemIndex)}
            {elem.actionType === "move" && <span>steps</span>}
            {elem.actionType === "glide" && (
              <span>secs to random position</span>
            )}
            {elem.actionType.includes("turn") && <span>degrees</span>}
            {elem.actionType === "say" && (
              <div className="flex flex-row justify-evenly">
                <span>for </span>
                {renderInputElement(elem, 2, elemIndex)}
                <span> seconds</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleRun}
        className="absolute top-4 right-4 p-2 bg-indigo-500 text-white rounded flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
        </svg>
        Run
      </button>
      <button
        onClick={handleReset}
        className="absolute top-16 right-4 p-2 bg-gray-500 text-white rounded flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
            clipRule="evenodd"
          />
        </svg>
        Reset
      </button>
    </div>
  );
};

export default MidArea;
