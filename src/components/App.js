import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Search, { useVenues } from "./Search";
import List from "./List";
import Venue from "./VenueDetail";
import Banner from "./Banner";
import Navbar from "./Navbar";
import * as R from 'ramda'

const AppLayout = styled.div`
  display: grid;
  grid-template-areas:
    "banner banner banner"
    "search list detail";
  grid-template-rows: 140px 1fr;
  grid-template-columns: 3fr 2fr 2fr;
  width: 100vw;
  min-height: 100vh;
  background: #1f2124;
`;

function useFavoritesFirst(currentUserProfile, venues) {
  const [orderedVenues, setOrderedVenues] = useState(venues);
  const favoriteVenues = currentUserProfile ? currentUserProfile.favoriteVenues : []
  const isFavorite = (venue) => currentUserProfile && R.includes(venue.id, currentUserProfile.favoriteVenues)
  function favoritesFirst(a, b) {
    const aFav = isFavorite(a);
    const bFav = isFavorite(b);
    if (aFav && bFav) { return 0 }
    if (!aFav && !bFav) { return 0 }
    if (aFav && !bFav) { return -1 }
    if (!aFav && bFav) { return 1 }
  }
  const orderByFavorites = () => {
    const ordered = R.sort(favoritesFirst, venues.map(venue => ({
      ...venue,
      isFavorite: isFavorite(venue)
    })))
    setOrderedVenues(ordered);
  };
  useEffect(() => {
    orderByFavorites();
  }, [favoriteVenues, venues]);
  return orderedVenues
}

export default function App(props) {
  const { currentUserProfile, updateCurrentUserProfile, venueData } = props;
  const { venues, address, setVenues, getUserActions } = venueData;
  const userActions = getUserActions({ updateCurrentUserProfile })
  const { orderedVenues, currentVenue, setCurrentVenue } = venueData;
  return (
    <AppLayout>
      <Banner>
        <Navbar />
      </Banner>
      <Search
        {...venueData}
        orderedVenues={orderedVenues}
        currentVenue={currentVenue}
        setCurrentVenue={setCurrentVenue}
      />
      {venues.length > 0 && (
        <List
          listOf="venues"
          venues={orderedVenues}
          address={address}
          currentVenue={currentVenue}
          setCurrentVenue={setCurrentVenue}
          actions={userActions}
          currentUserProfile={currentUserProfile}
        />
      )}
      {currentVenue && (
        <Venue
          venue={currentVenue}
          actions={userActions}
          currentUserProfile={currentUserProfile}
        />
      )}
    </AppLayout>
  );
}
