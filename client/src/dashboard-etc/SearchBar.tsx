import { Search } from "lucide-react";

function SearchBar() {
  return (
    <div className="flex align-center text-green-500">
      <Search />
      <form action="/search" method="get" role="search">
        <label>Search your repo</label>
        <p></p>
        <input
          type="search"
          id="site-search"
          name="q"
          placeholder="Enter search terms..."
          aria-label="Search through repo"
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default SearchBar;
