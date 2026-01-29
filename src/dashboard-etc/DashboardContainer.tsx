import "../main.css";
import SearchBar from "./SearchBar";

import SideBar from "./SideBar";

function DashboardContainer() {
  return (
    <>
      <div className="flex-column align-start">
        <SideBar />

        <SearchBar />
      </div>
    </>
  );
}

export default DashboardContainer;
