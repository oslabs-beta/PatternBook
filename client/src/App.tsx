import "./main.css";
import Dashboard from "./dashboard-etc/Dashboard.tsx";


function App() {

  return (
    <>
    <div className="flex-row items-center text-2xl text-blue-800 p-3 m-5 bg-blue-200 rounded border-4 border-purple-400">

    
    <h1 className="flex justify-center items-center border m-2 rounded blue-500 w-[20%]">
    Pattern Book
    </h1>
    <Dashboard />
    </div>
    </>
  );
}

export default App;
