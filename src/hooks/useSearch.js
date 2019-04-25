import React, { useState } from 'react';
import { searchNearAddress } from "./../stitch";

export default function useSearch() {
  const defaultData = {
    location: null,
    events: [],
    venues: []
  };
  const [data, setData] = useState(defaultData);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = async address => {
    setIsSearching(true);
    const searchResult = await searchNearAddress(address);
    setData(searchResult);
    setIsSearching(false);
  };
  const clearData = () => {
    setData(defaultData);
  };

  return {
    data,
    isSearching,
    actions: {
      handleSearch,
      clearData,
    },
  };
}
