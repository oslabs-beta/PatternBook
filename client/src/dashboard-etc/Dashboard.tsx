import "../main.css";
import SearchBar from "./SearchBar";
import PlayGround from "./PlayGround";
import SideBar from "./SideBar";
import { useState } from "react";
import { Search } from "lucide-react";

function Dashboard() {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <>
      <div className="flex-column align-start">
        <SideBar />
        <PlayGround />
        <Search
          onClick={() => setIsVisible(isVisible)}
          className="cursor-pointer hover:text-blue-100 transition"
          size={24}
        />
        {isVisible && (
          <div>
            <SearchBar />
          </div>
        )}
        {/* <Search onClick={() => setShowComponent(true)} /> */}
      </div>
    </>
  );
}

export default Dashboard;
