import { Menu } from "lucide-react";

function SideBar() {
  return (
    <div className="flex-wrap row justify-self-start text-red-500">
        <Menu size="100"/>
      <h4>
        {" "}
    
      </h4>
      <div>
        <ul>
          <li>
            {" "}
             <button type="button" className="flex justify-center bg-gray-600 rounded p-1 m-4"> <p> Home</p>{" "}
              </button>
          </li>
          <li>
            {" "}
           <button  className="flex justify-center bg-gray-600 rounded p-1 m-4"> <p> Log</p>{" "}
              </button>
          </li>
           <li>
            {" "}
            <button  className="flex justify-center bg-gray-600 rounded p-1 m-4"> <p> Documentation/ user guide</p>{" "}
              </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
