import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Search, { useVenues } from "./Search";
import List from "./List";
import Venue from "./VenueDetail";
import Event from "./EventDetail";
import Banner from "./Banner";
import Navbar from "./Navbar";

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

export default function App(props) {
  const venueSearch = useVenues();
  const { venues, address } = venueSearch;
  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentVenue, setCurrentVenue] = useState(null);
  const searchFor = "venues";
  return (
    <AppLayout>
      <Banner>
        <Navbar />
      </Banner>
      <Search {...venueSearch} setCurrentVenue={setCurrentVenue} />
      {venues.length > 0 && (
        <List
          listOf={searchFor}
          venues={venues}
          address={address}
          currentVenue={currentVenue}
          setCurrentVenue={setCurrentVenue}
        />
      )}
      {currentEvent && <Event event={currentEvent} />}
      {currentVenue && <Venue venue={currentVenue} />}
    </AppLayout>
  );
}
