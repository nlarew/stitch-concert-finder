import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
  createContext,
} from "react";
import { searchNearAddress } from "./../stitch";

const SearchContext = createContext();

// Export a hook that lets us access Search data anywhere inside of SearchProvider
function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error(`useSearch must be used within a SearchProvider`);
  }
  return context;
}

// Search data is accessible anywhere inside of this component
function SearchProvider(props) {
  // Search state
  const nothingSearched = {
    location: null,
    events: [],
    venues: []
  };
  const [isSearching, setIsSearching] = useState(false);
  const [data, setData] = useState(nothingSearched);

  // Search actions
  const handleSearch = useCallback(async (address) => {
    setIsSearching(true);
    const searchResult = await searchNearAddress(address);
    setData(searchResult);
    setIsSearching(false);
  }, [])
  const clearData = useCallback(() => {
    setData(nothingSearched)
  }, [])
  const actions = useMemo(() => ({ handleSearch, clearData }), []);
  
  // Wrap all children in the React Context provider
  const value = useMemo(() => ({ isSearching, data, actions }), [isSearching]);
  return (
    <SearchContext.Provider value={value}>
      {props.children}
    </SearchContext.Provider>
  );
};

export { SearchProvider, useSearch }
