import React from "react";
import Icon from "../Icon";
import MotionSection from "./MotionSection/MotionSection";
import LooksSection from "./LooksSection/LookSection";

export default function Sidebar() {
  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200 bg-gray-50">
      <div className="font-bold text-gray-700 mt-2 mb-1">{"Events"}</div>

      <div className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-xs cursor-pointer rounded hover:bg-yellow-600 transition-colors">
        {"When "}
        <Icon name="flag" size={15} className="text-green-600 mx-2" />
        {"clicked"}
      </div>

      <div className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-xs cursor-pointer rounded hover:bg-yellow-600 transition-colors">
        {"When this sprite clicked"}
      </div>

      <MotionSection />
      <LooksSection />
    </div>
  );
}
