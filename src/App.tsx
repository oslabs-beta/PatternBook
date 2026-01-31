// import { useState } from "react";
import "./main.css"; //update this when ready with css
import Dashboard from "./dashboard-etc/Dashboard.tsx";

function App() {
  return (
    <>
      <div className="flex-wrap max-width-500 items-center justify-center min-h-screen bg-black">
        <h1 className="justify-center text-xl text-white">Pattern Book</h1>
        <Dashboard />
      </div>
    </>
  );
}

export default App;
