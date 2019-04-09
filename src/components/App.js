import React from "react";
import styled from "@emotion/styled";
import Search from "./Search";
import List from "./List";
import Venue from "./VenueDetail";
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
  const { currentUserProfile, setCurrentUserProfile, venueData } = props;
  const { venues, address, getUserActions } = venueData;
  const { orderedVenues, currentVenue, setCurrentVenue } = venueData;
  const userActions = getUserActions({ setCurrentUserProfile });
  return (
    <AppLayout>
      <Banner>
        <Navbar />
      </Banner>
      <Search
        {...venueData}
        venues={venues}
        orderedVenues={orderedVenues}
        currentVenue={currentVenue}
        setCurrentVenue={setCurrentVenue}
      />
      {venues.length > 0 && (
        <List
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
