import "../main.css";
import PlayGround from "./PlayGround";
import SearchBar from "./SearchBar";

import SideBar from "./SideBar";



function Dashboard() {


  return (
    <>
      <div className="flex-wrap column text-red-500 justify-center max-w-400">

        <SideBar />

       <PlayGround />
    
        <SearchBar/>
      </div>
    </>
  )
}

export default Dashboard;
