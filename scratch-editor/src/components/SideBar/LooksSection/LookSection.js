import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import {
  enqueueAction,
  setMessage,
  setShowMessage,
  setBubblePosition,
} from "../../actions";

export const hideSprite = (spriteId) => {
  const el = document.getElementById(`character-${spriteId}`);
  if (!el) return;
  el.style.display = "none";
};

export const showSprite = (spriteId) => {
  const el = document.getElementById(`character-${spriteId}`);
  if (!el) return;
  el.style.display = "block";
};

export const showMessageBubble = (
  showMessage,
  message,
  manageTime,
  dispatch,
  spriteId
) => {
  dispatch(setShowMessage(showMessage, spriteId));
  dispatch(setMessage(message, spriteId));

  if (showMessage) {
    const el = document.getElementById(`character-${spriteId}`);
    if (el) {
      const rect = el.getBoundingClientRect();
      const bubblePos = {
        top: rect.top - 30,
        left: rect.left + rect.width / 2,
        show: "block",
      };
      dispatch(setBubblePosition(bubblePos, spriteId));
    }

    const timer = setTimeout(() => {
      const el = document.getElementById(`character-${spriteId}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        dispatch(setShowMessage(false, spriteId));
        const bubblePos = {
          top: rect.top - 30,
          left: rect.left + rect.width / 2,
          show: "none",
        };
        dispatch(setBubblePosition(bubblePos, spriteId));
      }
    }, manageTime * 1000);

    return () => clearTimeout(timer);
  }
};

export const showThinkBubble = (
  showThink,
  message,
  manageTime,
  dispatch,
  spriteId
) => {
  const isShow = !showThink;
  dispatch(setShowMessage(isShow, spriteId));
  dispatch(setMessage(message, spriteId));

  if (isShow) {
    const el = document.getElementById(`character-${spriteId}`);
    if (el) {
      const rect = el.getBoundingClientRect();
      const bubblePos = {
        top: rect.top - 30,
        left: rect.left + rect.width / 2,
        show: "block",
      };
      dispatch(setBubblePosition(bubblePos, spriteId));
    }

    const timer = setTimeout(() => {
      const el = document.getElementById(`character-${spriteId}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        dispatch(setShowMessage(!isShow, spriteId));
        const bubblePos = {
          top: rect.top - 30,
          left: rect.left + rect.width / 2,
          show: "none",
        };
        dispatch(setBubblePosition(bubblePos, spriteId));
      }
    }, manageTime * 1000);

    return () => clearTimeout(timer);
  }
};

const LooksSection = ({ spriteId }) => {
  const [manageTime, setManageTime] = useState(2);
  const [message, setMessage] = useState("Hello!");
  const [showMessage, setShowMessage] = useState(false);
  const [thinkMessage, setThinkMessage] = useState("Hmm...");
  const [thinkTime, setThinkTime] = useState(2);
  const [showThink, setShowThink] = useState(false);
  const dispatch = useDispatch();

  const handleDragStart = (e, actionType) => {
    e.dataTransfer.setData("actionType", actionType);
    e.dataTransfer.setData("spriteId", spriteId);
    if (actionType === "show" || actionType === "hide") {
      e.dataTransfer.setData("value", null);
    } else if (actionType === "say") {
      e.dataTransfer.setData(
        "value",
        `${message}_${showMessage}_${manageTime}`
      );
    } else if (actionType === "think") {
      e.dataTransfer.setData(
        "value",
        `${thinkMessage}_${showThink}_${thinkTime}`
      );
    }
  };

  const handleHide = () => {
    hideSprite(spriteId);
    dispatch(enqueueAction("hide", spriteId));
  };

  const handleShow = () => {
    showSprite(spriteId);
    dispatch(enqueueAction("show", spriteId));
  };

  const handleSay = () => {
    showMessageBubble(showMessage, message, manageTime, dispatch, spriteId);
    dispatch(
      enqueueAction(`say ${message}_${showMessage}_${manageTime}`, spriteId)
    );
  };

  const handleThink = () => {
    showThinkBubble(showThink, thinkMessage, thinkTime, dispatch, spriteId);
    dispatch(
      enqueueAction(`think ${thinkMessage}_${showThink}_${thinkTime}`, spriteId)
    );
  };

  const handleSetMessage = (e) => {
    setMessage(e.target.value);
    dispatch(setMessage(e.target.value, spriteId));
  };

  const handleSetThinkMessage = (e) => {
    setThinkMessage(e.target.value);
  };

  const handleSetManageTime = (e) => {
    setManageTime(e.target.value ? parseInt(e.target.value) : 0);
  };

  const handleSetThinkTime = (e) => {
    setThinkTime(e.target.value ? parseInt(e.target.value) : 0);
  };

  return (
    <Fragment>
      <div className="font-bold text-gray-700 mt-4 mb-2">{"Looks"}</div>

      <div
        className="action-block flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-xs cursor-pointer rounded hover:bg-purple-600 transition-colors"
        draggable
        onDragStart={(e) => handleDragStart(e, "show")}
        onClick={handleShow}
      >
        {"Show"}
      </div>

      <div
        className="action-block flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-xs cursor-pointer rounded hover:bg-purple-600 transition-colors"
        draggable
        onDragStart={(e) => handleDragStart(e, "hide")}
        onClick={handleHide}
      >
        {"Hide"}
      </div>

      <div
        className="action-block flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-xs cursor-pointer rounded hover:bg-purple-600 transition-colors"
        draggable
        onDragStart={(e) => handleDragStart(e, "say")}
        onClick={handleSay}
      >
        <span>{"Say"}</span>
        <input
          value={message}
          onChange={handleSetMessage}
          onClick={(e) => e.stopPropagation()}
          className="text-black w-12 text-center mx-2 border border-white bg-white rounded-full"
        />
        <span>{"for"}</span>
        <input
          value={manageTime}
          onChange={handleSetManageTime}
          onClick={(e) => e.stopPropagation()}
          className="text-black w-6 text-center mx-2 border border-white bg-white rounded-full"
        />
        <span>{"seconds"}</span>
      </div>

      <div
        className="action-block flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-xs cursor-pointer rounded hover:bg-purple-600 transition-colors"
        draggable
        onDragStart={(e) => handleDragStart(e, "think")}
        onClick={handleThink}
      >
        <span>{"Think"}</span>
        <input
          value={thinkMessage}
          onChange={handleSetThinkMessage}
          onClick={(e) => e.stopPropagation()}
          className="text-black w-12 text-center mx-2 border border-white bg-white rounded-full"
        />
        <span>{"for"}</span>
        <input
          value={thinkTime}
          onChange={handleSetThinkTime}
          onClick={(e) => e.stopPropagation()}
          className="text-black w-6 text-center mx-2 border border-white bg-white rounded-full"
        />
        <span>{"seconds"}</span>
      </div>
    </Fragment>
  );
};

export default LooksSection;
