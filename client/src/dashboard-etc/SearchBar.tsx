import "../main.css"
import { useRegistryStore } from "../stores/registryStore";


function SearchBar() {
   const searchQuery = useRegistryStore((state) => state.searchQuery);
  const setSearchQuery = useRegistryStore ((state) => state.setSearchQuery)
  const filteredCoomponents = useRegistryStore((state) => state.filteredComponents)

  return(
    <div className="flex align-center text-xs text-purple-500 rounded w-[100%]">

      <form action="/search" method="get" role="search">
        <input
          type="text"
          className="border border-pink-500"
          value={searchQuery}
          onChange={(e)=> {
            setSearchQuery(e.target.value) }
          }
          placeholder="search"
        />
        <p>Found {filteredCoomponents.length} component(s)</p>
        
      </form>    
    </div>

  )
}

export default SearchBar;
