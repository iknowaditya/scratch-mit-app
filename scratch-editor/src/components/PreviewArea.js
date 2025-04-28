import React, { useRef } from "react";
import CatSprite from "./CatSprite";
import PandaSprite from "./PandaSprite";
import { useSelector } from "react-redux";
import PigSprit from "./PigSprit";

const PreviewArea = ({ sprites }) => {
  const spriteStates = useSelector((state) => state.sprites || {});
  const dragItem = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e, spriteId) => {
    const element = document.getElementById(`character-${spriteId}`);
    if (!element) return;

    dragItem.current = element;
    const rect = element.getBoundingClientRect();

    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!dragItem.current) return;

    const container = document.getElementById("preview-area-container");
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    const newX = e.clientX - dragOffset.current.x - containerRect.left;
    const newY = e.clientY - dragOffset.current.y - containerRect.top;

    // Boundary checks
    const maxX = containerRect.width - dragItem.current.offsetWidth;
    const maxY = containerRect.height - dragItem.current.offsetHeight;

    dragItem.current.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
    dragItem.current.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
    dragItem.current.style.position = "absolute";
  };

  const handleMouseUp = () => {
    dragItem.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="w-full flex-none h-full overflow-y-auto p-2 relative bg-gray-100"
      id="preview-area-container"
    >
      {sprites.map((sprite) => {
        const spriteState = spriteStates[sprite.id] || {};
        return (
          <div
            key={sprite.id}
            id={`character-${sprite.id}`}
            className="absolute transition-transform duration-200"
            style={{
              left: spriteState.x || 100,
              top: spriteState.y || 100,
              transform: `rotate(${spriteState.rotation || 0}deg)`,
              display: spriteState.visible === false ? "none" : "block",
              cursor: "move",
            }}
            onMouseDown={(e) => handleMouseDown(e, sprite.id)}
          >
            {spriteState.showMessage && (
              <div
                className="bg-white border border-black rounded px-2 py-1 absolute whitespace-nowrap"
                style={{
                  top: -30,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                }}
              >
                {spriteState.message}
              </div>
            )}
            {/* <CatSprite /> */}
            {sprite.type === "cat" && <CatSprite />}
            {sprite.type === "pig" && <PigSprit />}
            {sprite.type === "panda" && <PandaSprite />}
          </div>
        );
      })}
    </div>
  );
};

export default PreviewArea;
