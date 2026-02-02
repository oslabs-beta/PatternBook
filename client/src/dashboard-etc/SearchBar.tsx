import { Search } from "lucide-react";
import { useRegistryStore } from "../stores/registryStore";

function SearchBar() {
  const searchQuery = useRegistryStore((state) => state.searchQuery);
  const setSearchQuery = useRegistryStore ((state) => state.setSearchQuery)
  const filteredCoomponents = useRegistryStore((state) => state.filteredComponents)

  return (
    <>
    
  
    <div className="flex justify-center text-green-500">
      <form action="/search" method="get" role="search">

        <p></p>
        <input
          type="text"
          className="border border-pink-500"
          value ={searchQuery}
          onChange={(e)=> {
            setSearchQuery(e.target.value) }
          }
          placeholder="type component name"
        />
        <button type="submit"><Search size='100'/></button>
        <p>Found {filteredCoomponents.length} component(s)</p>
      </form>
    </div>
 </>
  );
}

export default SearchBar;
