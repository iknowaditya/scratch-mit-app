import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import Icon from "../../Icon";
import { enqueueAction } from "../../actions";

export const moveSprite = (steps, spriteId) => {
  const el = document.getElementById(`character-${spriteId}`);
  if (!el) return;

  const container = el.parentElement.parentElement;
  const elWidth = el.offsetWidth;
  const containerWidth = container.offsetWidth;
  const boundary = containerWidth - elWidth;
  const left = el.offsetLeft;

  el.style.position = "relative";
  const stepsToMove = Number(left) + Number(steps);
  if (stepsToMove > boundary) return;

  el.style.left = stepsToMove + "px";
};

export const turnSprite = (degree, direction, spriteId) => {
  const el = document.getElementById(`character-${spriteId}`);
  if (!el) return;

  let rotation = getRotationAngle(`character-${spriteId}`);
  let newRotation =
    direction === "left"
      ? rotation - Number(degree)
      : rotation + Number(degree);

  el.style.transform = `rotate(${newRotation}deg)`;
};

export const glideSprite = (glideTime, spriteId) => {
  const el = document.getElementById(`character-${spriteId}`);
  if (!el) return;

  const container = el.parentElement.parentElement;
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  const randomOffsetX = Math.random();
  const randomOffsetY = Math.random();

  const x = randomOffsetX * (containerWidth - el.offsetWidth);
  const y = randomOffsetY * (containerHeight - el.offsetHeight);

  el.style.position = "absolute";
  el.style.left = `${el.offsetLeft}px`;
  el.style.top = `${el.offsetTop}px`;
  el.offsetHeight; // Trigger reflow

  el.style.transition = `all ${glideTime}s ease-in-out`;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
};

export const goToPosition = (x, y, spriteId) => {
  const el = document.getElementById(`character-${spriteId}`);
  if (!el) return;

  el.style.position = "absolute";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
};

export const repeatAnimation = (times, action, spriteId) => {
  for (let i = 0; i < times; i++) {
    action();
  }
};

function getRotationAngle(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return 0;

  const style = window.getComputedStyle(element);
  const transform =
    style.transform || style.webkitTransform || style.mozTransform;

  if (transform === "none" || !transform) return 0;

  const matrixValues = transform.match(/matrix.*\((.+)\)/);
  if (!matrixValues) return 0;

  const values = matrixValues[1].split(", ");
  const a = parseFloat(values[0]);
  const b = parseFloat(values[1]);

  return Math.round(Math.atan2(b, a) * (180 / Math.PI));
}

const MotionSection = ({ spriteId }) => {
  const [moveSteps, setMoveSteps] = useState(10);
  const [undoSteps, setUndoSteps] = useState(15);
  const [redoSteps, setRedoSteps] = useState(15);
  const [glideTime, setGlideTime] = useState(1);
  const [xPos, setXPos] = useState(100);
  const [yPos, setYPos] = useState(100);
  const [repeatTimes, setRepeatTimes] = useState(2);
  const dispatch = useDispatch();

  const handleDragStart = (e, actionType) => {
    e.dataTransfer.setData("actionType", actionType);
    e.dataTransfer.setData("spriteId", spriteId);
    if (actionType === "move") {
      e.dataTransfer.setData("value", moveSteps);
    } else if (actionType === "turnLeft") {
      e.dataTransfer.setData("value", undoSteps);
    } else if (actionType === "turnRight") {
      e.dataTransfer.setData("value", redoSteps);
    } else if (actionType === "glide") {
      e.dataTransfer.setData("value", glideTime);
    } else if (actionType === "goTo") {
      e.dataTransfer.setData("value", `${xPos}_${yPos}`);
    } else if (actionType === "repeat") {
      e.dataTransfer.setData("value", repeatTimes);
    }
  };

  const handleClick = () => {
    moveSprite(moveSteps, spriteId);
    dispatch(enqueueAction(`move_right ${moveSteps}`, spriteId));
  };

  const handleUndoClick = () => {
    turnSprite(undoSteps, "left", spriteId);
    dispatch(enqueueAction(`turn_left ${undoSteps}`, spriteId));
  };

  const handleRedoClick = () => {
    turnSprite(redoSteps, "right", spriteId);
    dispatch(enqueueAction(`turn_right ${redoSteps}`, spriteId));
  };

  const handleGlide = () => {
    glideSprite(glideTime, spriteId);
    dispatch(enqueueAction(`glide ${glideTime}`, spriteId));
  };

  const handleGoToPosition = () => {
    goToPosition(xPos, yPos, spriteId);
    dispatch(enqueueAction(`go_to ${xPos}_${yPos}`, spriteId));
  };

  const handleRepeatAnimation = () => {
    dispatch(enqueueAction(`repeat ${repeatTimes}`, spriteId));
  };

  return (
    <Fragment>
      <div className="font-bold text-gray-700 mt-4 mb-2">{"Motion"}</div>

      <div
        className="action-block flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 cursor-pointer rounded items-center text-xs hover:bg-blue-600 transition-colors"
        draggable
        onDragStart={(e) => handleDragStart(e, "move")}
        onClick={handleClick}
      >
        <span>{"Move"}</span>
        <input
          value={moveSteps}
          onChange={(e) => setMoveSteps(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="text-black w-8 text-center mx-2 border border-white bg-white rounded-full"
        />
        <span>{"steps"}</span>
      </div>

      <div
        className="action-block flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 cursor-pointer rounded items-center text-xs hover:bg-blue-600 transition-colors"
        draggable
        onDragStart={(e) => handleDragStart(e, "turnLeft")}
        onClick={handleUndoClick}
      >
        <span>{"Turn"}</span>
        <Icon name="undo" size={15} className="text-white mx-2 mt-1" />
        <input
          value={undoSteps}
          onChange={(e) => setUndoSteps(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="text-black w-8 text-center mr-1 border border-white bg-white rounded-full"
        />
        <span>{"degrees"}</span>
      </div>

      <div
        className="action-block flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 cursor-pointer rounded items-center text-xs hover:bg-blue-600 transition-colors"
        draggable
        onDragStart={(e) => handleDragStart(e, "turnRight")}
        onClick={handleRedoClick}
      >
        <span>{"Turn"}</span>
        <Icon name="redo" size={15} className="text-white mx-2 mt-1" />
        <input
          value={redoSteps}
          onChange={(e) => setRedoSteps(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="text-black w-8 text-center mr-1 border border-white bg-white rounded-full"
        />
        <span>{"degrees"}</span>
      </div>

      <div
        className="action-block flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 cursor-pointer rounded items-center text-xs hover:bg-blue-600 transition-colors"
        draggable
        onDragStart={(e) => handleDragStart(e, "glide")}
        onClick={handleGlide}
      >
        <span>{"Glide"}</span>
        <input
          value={glideTime}
          onChange={(e) => setGlideTime(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="text-black w-8 text-center mx-2 border border-white bg-white rounded-full"
        />
        <span>{"secs to random position"}</span>
      </div>

      <div
        className="action-block flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 cursor-pointer rounded items-center text-xs hover:bg-blue-600 transition-colors"
        draggable
        onDragStart={(e) => handleDragStart(e, "goTo")}
        onClick={handleGoToPosition}
      >
        <span>{"Go to x:"}</span>
        <input
          value={xPos}
          onChange={(e) => setXPos(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="text-black w-8 text-center mx-2 border border-white bg-white rounded-full"
        />
        <span>{"y:"}</span>
        <input
          value={yPos}
          onChange={(e) => setYPos(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="text-black w-8 text-center mx-2 border border-white bg-white rounded-full"
        />
      </div>

      <div
        className="action-block flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 cursor-pointer rounded items-center text-xs hover:bg-blue-600 transition-colors"
        draggable
        onDragStart={(e) => handleDragStart(e, "repeat")}
        onClick={handleRepeatAnimation}
      >
        <span>{"Repeat"}</span>
        <input
          value={repeatTimes}
          onChange={(e) => setRepeatTimes(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="text-black w-8 text-center mx-2 border border-white bg-white rounded-full"
        />
        <span>{"times"}</span>
      </div>
    </Fragment>
  );
};

export default MotionSection;
