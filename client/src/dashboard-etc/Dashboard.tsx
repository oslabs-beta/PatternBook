import ResizableContainer from "../components/ResizeableContainer";
import "../main.css";
import SideBar from "./SideBar";

function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-10">
        <ResizableContainer/>
      </main>
    </div>
  );
}

export default Dashboard;
