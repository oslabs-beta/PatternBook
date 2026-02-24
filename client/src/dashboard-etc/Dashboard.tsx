import "../main.css";
import PlayGround from "./PlayGround";
import SideBar from "./SideBar";



function Dashboard() {

  
  return (
    <>
      <div className="flex column">
        <SideBar />
        <PlayGround />
      </div>
    </>
  );
}

export default Dashboard;
