import "../main.css"
import { useManifest } from "../hooks/useManifest";

function SearchBar() {

  const manifest = useManifest();
  const handleOnClick = (e:React.MouseEvent) => {
    e.preventDefault();
    console.log(manifest);
  }
  return (
    <div>
      <div className="flex align-center text-green-500 border border-green-500 w-[95%]">
        <form onSubmit={(e) => {
          e.preventDefault()
          console.log(manifest) }}> 
          <input 
            className="align-center w-[90%]"
            type="search"
            id="site-search"
            name="q"
            aria-label='form search misc'
            placeholder="Enter search terms..."
          />
        </form>      
      </div>
    </div>

  );
}

export default SearchBar;
