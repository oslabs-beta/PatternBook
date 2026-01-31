function SideBar() {
  return (
    <div className="flex-wrap justify-self-start text-red-500 border border-red-500">
      <h4>
        {" "}
        this is a sidebar.<br></br> it should be on the left side with options
        <br></br>
      </h4>
      <div>
        <ul>
          {" "}
          <p> actions: </p>
          <li>
            {" "}
            <p> option 1 </p>
          </li>
          <li>
            {" "}
            <p> option 2</p>{" "}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
