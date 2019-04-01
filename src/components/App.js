import React, { useState } from "react";
import styled from "@emotion/styled";
import Search, { useVenues } from "./Search";
import List from "./List";
import Venue from "./VenueDetail";
import Event from "./EventDetail";
import Banner from "./Banner";
import Navbar from "./Navbar";
import * as R from 'ramda'
import * as mongodbActions from './../stitch/mongodb'

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
  const { currentUserProfile, updateCurrentUserProfile } = props;
  const venueSearch = useVenues();
  const { venues, address, setVenues } = venueSearch;
  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentVenue, setCurrentVenue] = useState(null);
  const userActions = {
    addFavoriteVenue: async (venueId) => {
      console.log("addFavoriteVenue", venueId)
      const user = await mongodbActions.addFavoriteVenue({ venueId })
      updateCurrentUserProfile(user)
    },
    removeFavoriteVenue: async (venueId) => {
      console.log("removeFavoriteVenue", venueId)
      const user = await mongodbActions.removeFavoriteVenue({ venueId })
      updateCurrentUserProfile(user)
    },
    starEvent: async (venueId, eventId) => {
      console.log("starEvent", venueId, eventId)
      const venue = await mongodbActions.starEvent({ venueId, eventId })
      const venueIndex = venues.findIndex(v => v.id === venueId)
      setVenues(R.update(venueIndex, venue, venues))
    },
    unstarEvent: async (venueId, eventId) => {
      console.log("unstarEvent", venueId, eventId)
      const venue = await mongodbActions.unstarEvent({ venueId, eventId })
      const venueIndex = venues.findIndex(v => v.id === venueId)
      setVenues(R.update(venueIndex, venue, venues))
    },
  }
  return (
    <AppLayout>
      <Banner>
        <Navbar />
      </Banner>
      <Search {...venueSearch} setCurrentVenue={setCurrentVenue} />
      {venues.length > 0 && (
        <List
          listOf="venues"
          venues={venues}
          address={address}
          currentVenue={currentVenue}
          setCurrentVenue={setCurrentVenue}
          actions={userActions}
          currentUserProfile={currentUserProfile}
        />
      )}
      {currentVenue && <Venue venue={currentVenue} actions={userActions} currentUserProfile={currentUserProfile} />}
    </AppLayout>
  );
}
