import "../main.css";
import SearchBar from "./SearchBar";
import PlayGround from "./PlayGround";
import SideBar from "./SideBar";
import { Search } from "lucide-react";

function Dashboard() {
  return (
    <>
      <div className="flex-wrap justify-center">
        <SideBar />
        <PlayGround />
        <Search />
        <SearchBar />
      </div>
    </>
  );
}

export default Dashboard;
