import React, { useState, useRef } from "react";
import Sidebar from "./components/SideBar/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";
import SideColorPane from "./components/SideColorPane/SideColorPane";
import { SquarePlus, Trash2, Play } from "lucide-react";
import CollisionDetector from "./components/CollisionDetector";

export default function App() {
  const [sprites, setSprites] = useState([{ id: 1, type: "cat" }]);
  const spriteRefs = useRef({});

  const maxSprites = 3;
  const spriteTypes = ["cat", "pig", "panda"];

  const addSprite = () => {
    if (sprites.length < maxSprites) {
      const nextType = spriteTypes[sprites.length % spriteTypes.length];
      setSprites([...sprites, { id: Date.now(), type: nextType }]);
    }
  };

  const removeSprite = (id) => {
    if (sprites.length > 1) {
      setSprites(sprites.filter((sprite) => sprite.id !== id));
    }
  };

  const handleGlobalPlay = () => {
    Object.values(spriteRefs.current).forEach((midAreaRef) => {
      if (midAreaRef) {
        midAreaRef.runActions();
      }
    });
  };

  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="flex justify-center mb-4">
        <button
          onClick={handleGlobalPlay}
          className="p-2 bg-green-500 text-white rounded flex items-center hover:bg-green-600 transition-colors"
        >
          <Play size={16} className="mr-1" />
          Play All Sprites
        </button>
      </div>
      <div className="h-screen overflow-hidden flex flex-row">
        <div className="flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <SideColorPane />
          <Sidebar />
        </div>

        <div className="flex-1 flex overflow-x-auto">
          {sprites.map((sprite, index) => (
            <div
              key={sprite.id}
              className="h-screen flex-1 min-w-[400px] relative bg-white border-r border-gray-200"
              data-sprite-id={sprite.id}
            >
              <MidArea
                spriteId={sprite.id}
                ref={(el) => (spriteRefs.current[sprite.id] = el)}
              />
              {index > 0 && (
                <button
                  onClick={() => removeSprite(sprite.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full z-10 hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {sprites.length < maxSprites && (
          <div className="flex items-center px-2">
            <button
              onClick={addSprite}
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              title="Add Sprite"
            >
              <SquarePlus size={20} />
            </button>
          </div>
        )}

        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea sprites={sprites} />
        </div>
      </div>
      <CollisionDetector sprites={sprites} />
    </div>
  );
}
