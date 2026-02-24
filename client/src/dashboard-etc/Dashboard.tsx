import "../main.css";
import PlayGround from "./PlayGround";
import SideBar from "./SideBar";

function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <PlayGround />
      </main>
    </div>
  );
}

export default Dashboard;
