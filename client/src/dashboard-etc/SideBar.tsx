import SearchBar from "./SearchBar.tsx";
import { Play, Save, Search, GalleryThumbnails, Bell, Rewind } from "lucide-react";
import { useState } from "react";
import "../main.css";
// import { useManifest } from "../hooks/useManifest.ts";

function SideBar() { 
  const [isVisible, setIsVisible] = useState(false);
  // const manifest = 
  // const handleManifest =  () => {
  // useManifest;

  // }
  
  return (
  <div className="flex-row justify-content-center p-3 m-3 text-blue-500 bg-blue-200 rounded border border-purple-400 w-[10%]">
      <Play 
        onClick={() => {"show documents"}}
        className="cursor-pointer hover:text-red-500 size-[96] transition"
        
        size={24}
      />
      <Save 
      className="cursor-pointer hover:text-red-500 transition"
      />

      <Rewind 
      className="cursor-pointer hover:text-red-500 transition"
      />

      <Bell 
      className="cursor-pointer hover:text-red-500 transition"
      />

      <GalleryThumbnails 
      className="cursor-pointer hover:text-red-500 transition"
      />

      <Search
        onClick={() => setIsVisible(!isVisible) }
        className="cursor-pointer hover:text-red-500 transition"
        size={24}
      />
    
    {isVisible && (
      <div className="flex-row justify-center text-purple-400 border rounded border-purple-500 w-[100%]">
        <SearchBar />
      </div>
    )}
    </div>
  );
}

export default SideBar;