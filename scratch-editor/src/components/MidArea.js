import React, { useState } from "react";
import {
  moveSprite,
  turnSprite,
  glideSprite,
  goToPosition,
} from "./SideBar/MotionSection/MotionSection";
import {
  hideSprite,
  showSprite,
  showMessageBubble,
  showThinkBubble,
} from "./SideBar/LooksSection/LookSection";
import Icon from "./Icon";
import { enqueueAction, setMessage } from "./actions";
import { useDispatch } from "react-redux";

const MidArea = ({ spriteId }) => {
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
      const steps = parseInt(value);
      moveSprite(steps, spriteId);
      dispatch(enqueueAction(`move_right ${steps}`, spriteId));
    } else if (actionType === "turnLeft") {
      const degrees = parseInt(value);
      turnSprite(degrees, "left", spriteId);
      dispatch(enqueueAction(`turn_left ${degrees}`, spriteId));
    } else if (actionType === "turnRight") {
      const degrees = parseInt(value);
      turnSprite(degrees, "right", spriteId);
      dispatch(enqueueAction(`turn_right ${degrees}`, spriteId));
    } else if (actionType === "show") {
      showSprite(spriteId);
      dispatch(enqueueAction("show", spriteId));
    } else if (actionType === "hide") {
      hideSprite(spriteId);
      dispatch(enqueueAction("hide", spriteId));
    } else if (actionType === "glide") {
      const time = parseInt(value);
      glideSprite(time, spriteId);
      dispatch(enqueueAction(`glide ${time}`, spriteId));
    } else if (actionType === "say") {
      const arg = value.split("_");
      showMessageBubble(
        !Boolean(arg[1]),
        arg[0],
        Number(arg[2]),
        dispatch,
        spriteId
      );
      dispatch(enqueueAction(`say ${value}`, spriteId));
    } else if (actionType === "goTo") {
      const [x, y] = value.split("_").map(Number);
      goToPosition(x, y, spriteId);
      dispatch(enqueueAction(`go_to ${x}_${y}`, spriteId));
    } else if (actionType === "think") {
      const arg = value.split("_");
      showThinkBubble(
        !Boolean(arg[1]),
        arg[0],
        Number(arg[2]),
        dispatch,
        spriteId
      );
      dispatch(enqueueAction(`think ${value}`, spriteId));
    } else if (actionType === "repeat") {
      dispatch(enqueueAction(`repeat ${value}`, spriteId));
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
    if (
      (elem.actionType === "say" || elem.actionType === "think") &&
      index === 0
    ) {
      dispatch(setMessage(value, spriteId));
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
    <div className="relative h-full w-full ">
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
              elem.actionType === "say" ||
              elem.actionType === "think"
                ? "bg-purple-500"
                : "bg-blue-500"
            } flex flex-row flex-wrap text-white px-2 py-1 my-2 cursor-pointer rounded items-center text-xs hover:opacity-90 transition-opacity`}
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
            <span>{elem.actionType === "think" && "Think"}</span>
            <span>{elem.actionType === "goTo" && "Go to"}</span>
            <span>{elem.actionType === "repeat" && "Repeat"}</span>

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
            {elem.actionType === "goTo" && (
              <>
                <span>x:</span>
                {renderInputElement(elem, 0, elemIndex)}
                <span>y:</span>
                {renderInputElement(elem, 1, elemIndex)}
              </>
            )}
            {elem.actionType === "repeat" && <span>times</span>}
            {(elem.actionType === "say" || elem.actionType === "think") && (
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
        className="absolute top-4 right-4 p-2 bg-indigo-500 text-white rounded flex items-center hover:bg-indigo-600 transition-colors"
      >
        Run
      </button>

      <button
        onClick={handleReset}
        className="absolute top-16 right-4 p-2 bg-gray-500 text-white rounded flex items-center hover:bg-gray-600 transition-colors"
      >
        Reset
      </button>
    </div>
  );
};

export default MidArea;
