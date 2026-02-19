import SearchBar from "./SearchBar.tsx";
import { Play, Search, GalleryThumbnails, Bell, Rewind } from "lucide-react";

import PlayGround from "./PlayGround.tsx";
import { useState } from "react";
import "../main.css";
import { useManifest } from "../hooks/useManifest.ts";

function SideBar() { 
  const [isVisible, setIsVisible] = useState(false);
  const handleManifest = useManifest;

  return (
  <div className="flex-row justify-self-start text-blue-500 border border-blue-500 w-[15%]">
      <h6> {"Sidebar"} </h6>
        <Play 
          onClick={() => handleManifest}
          className="cursor-pointer hover:text-red-500 transition"
          size={24}
        />


        {isVisible && (
          <div className="flex-row justify-center text-purple-400 border border-purple-500 w-[90%]">
            {"handleManifest"}
            <PlayGround />
          </div>
        )}
      

      <Rewind 
      onClick={ () => setIsVisible(!isVisible)}
      className="cursor-pointer hover:text-red-500 transition"
      />
      <Bell 
      onClick={ () => setIsVisible(!isVisible)}
      className="cursor-pointer hover:text-red-500 transition"
      />
      <GalleryThumbnails 
      onClick={ () => setIsVisible(!isVisible)}
      className="cursor-pointer hover:text-red-500 transition"
      />
    <Search
      onClick={() => setIsVisible(!isVisible) }
      className="cursor-pointer hover:text-red-500 transition"
      size={24}
    />
    {isVisible && (
      <div className="flex-row justify-center text-purple-400 border border-purple-500 w-[90%]">
        <SearchBar />
      </div>
    )}

    </div>
  );
}

export default SideBar;
