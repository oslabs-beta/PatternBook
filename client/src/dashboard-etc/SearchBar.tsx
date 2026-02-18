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

    <div className="flex align-start text-green-500 border border-green-500 w-[350px]">
      <form onSubmit={(e) => {
        e.preventDefault()
        console.log(manifest)
      }}> 
        <input
          type="search"
          id="site-search"
          name="q"
          aria-label='form search misc'
          placeholder="Enter search terms..."
        />
        <button className='bg-white' type="submit" >Search</button>
      </form>      
    </div>
        </div>

  );
}

export default SearchBar;
