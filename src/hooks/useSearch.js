import React, { useState, useEffect, useContext, createContext } from "react";
import { searchNearAddress } from "./../stitch";

// Export a hook that lets us access Search data anywhere inside of SearchProvider
const SearchContext = createContext();
const useSearch = () => useContext(SearchContext);
export default useSearch;

// Search data is accessible anywhere inside of this component
export const SearchProvider = ({ children }) => {
  // Search state
  const nothingSearched = {
    location: null,
    events: [],
    venues: []
  };
  const [isSearching, setIsSearching] = useState(false);
  const [data, setData] = useState(nothingSearched);

  // Search actions
  const actions = {
    handleSearch: async (address) => {
      setIsSearching(true);
      const searchResult = await searchNearAddress(address);
      setData(searchResult);
      setIsSearching(false);
    },
    clearData: () => {
      setData(nothingSearched)
    },
  };
  
  // Wrap all children in the React Context provider
  return (
    <SearchContext.Provider value={{ isSearching, data, actions }}>
      {children}
    </SearchContext.Provider>
  );
};
