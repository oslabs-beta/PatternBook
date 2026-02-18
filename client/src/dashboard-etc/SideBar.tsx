import SearchBar from "./SearchBar.tsx";
import { Search } from "lucide-react";
import { useState } from "react";
import "../main.css";

function SideBar() {

  
  const [isVisible, setIsVisible] = useState(false);



  return (
  <div className="flex-row justify-self-start text-red-500 border border-red-500 w-[15%]">
      <h4> {"Sidebar"} </h4>
          <Search
          onClick={() => setIsVisible(!isVisible) }
          className="cursor-pointer hover:text-blue-100 transition"
          size={24}
        />
        {isVisible && (
          <div>
            <SearchBar />
          </div>
        )}
      </div>
  );
}

export default SideBar;
