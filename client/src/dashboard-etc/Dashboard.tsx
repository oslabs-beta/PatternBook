import "../main.css";
import PlayGround from "./PlayGround";
import SideBar from "./SideBar";



function Dashboard() {
  //   const setManifest = useRegistryStore((state) => state.setManifest);

  // useEffect(() => {
  //   fetch("/mock-data/manifest.json")
  //     .then((res) => res.json())
  //     .then((data) => setManifest(data))
  //     .catch(console.error);
  // }, [setManifest]);
  
  return (
    <>
      <div>
        <SideBar />
      

        <PlayGround />
      </div>
    </>
  );
}

export default Dashboard;
