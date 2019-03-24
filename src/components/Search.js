import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import ErrorBoundary from "react-error-boundary";
import {
  Button,
  Card,
  CardBody,
  InputGroup,
  Input,
  InputGroupAddon,
  Table,
} from "reactstrap";
import LeafMap from "./Map";

import { Songkick } from "./../stitch";

const SearchBarContainer = styled(InputGroup)`
  width: 100%;
`;
const SearchBarButton = styled(InputGroupAddon)``;
const SearchBarInput = styled(Input)`
  height: 70px !important;
  background-color: white;
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 20px;
  line-height: 40px;
`;
const SearchBar = props => {
  const { address, search, onChange } = props;
  const handleSearch = () => {
    search(address);
  };
  // onChange={handleEventInputChange}
  // value={address}
  // placeholder="Enter your address..."
  // search={search}
  return (
    <SearchBarContainer>
      <SearchBarInput
        onChange={onChange}
        value={address}
        placeholder="Enter your address..."
        search={search}
      />
      <InputGroupAddon addonType="append">
        <Button color="info" onClick={handleSearch}>
          Search Nearby Venues
        </Button>
      </InputGroupAddon>
    </SearchBarContainer>
  );
};

// Date: start.date
// Name: displayName
// Artist: performance[0].artist.displayName
// Venue: venue.displayName
// Time: start.time

const EventsTable = styled(Table)`
  flex-grow: 10;
`;

const EventsTableBody = styled.tbody`
  overflow-y: scroll;
`;

const EventsList = props => {
  const { events } = props;
  const renderEventRows = () => {
    return events.map(event => (
      <tr key={event.id}>
        <td>{event.start.date}</td>
        <td>{event.displayName}</td>
        <td>{event.performance[0].artist.displayName}</td>
        <td>{event.venue.displayName}</td>
        <td>{event.start.time}</td>
      </tr>
    ));
  };
  return (
    <EventsTable dark>
      <thead>
        <tr>
          <th colSpan="5">
            <a href="https://www.songkick.com/">
              <img
                height="30px"
                src="https://stitch-statichosting-prod.s3.amazonaws.com/5c95208750626e9adb7c1723/powered-by-songkick-white.svg"
              />
            </a>
          </th>
        </tr>
        <tr>
          <th>Date</th>
          <th>Event</th>
          <th>Artist</th>
          <th>Venue</th>
          <th>Time</th>
        </tr>
      </thead>
      <EventsTableBody>{renderEventRows()}</EventsTableBody>
    </EventsTable>
  );
};

function useEventSearch(addr) {
  const [address, setAddress] = useState(addr);
  const [events, setEvents] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleEventInputChange = e => {
    setAddress(e.currentTarget.value);
  };

  function search(addr) {
    if (fetching) {
      cancelCurrentSearch();
    }
    setFetching(true);
  }

  function cancelCurrentSearch() {
    setFetching(false);
  }

  function searchForEvents() {
    if (fetching) {
      const upcoming = Songkick.getUpcomingEventsForVenue("foobar lounge").then(
        events => {
          setEvents(events);
          setFetching(false);
        },
      );
      return () => upcoming.promiseStatus === "pending" && upcoming.reject();
    }
  }
  useEffect(searchForEvents, [fetching]);

  const [venues, setVenues] = useState([]);
  function groupEventsByVenue() {
    let upcomingVenues = [];
    events.forEach(event => {
      if (upcomingVenues.includes(event.venue)) {
        upcomingVenues = upcomingVenues.map(venue => {
          return event.venue.id === venue.id
            ? { ...event.venue, events: [...event.venue.events, event] }
            : event;
        });
      } else {
        upcomingVenues.push({ ...event.venue, events: [event] });
      }
    });
    setVenues(upcomingVenues);
  }
  useEffect(groupEventsByVenue, [events]);

  return { events, venues, address, search, handleEventInputChange };
}

const SearchLayout = styled.div`
  width: 100%;
`;

const ContentCard = styled(Card)`
  grid-area: search;
  margin: 10px;
  background-color: #383a3f !important;
  background-color: #3e4348 !important;
  background-color: #1f2124 !important;
  position: relative;
  top: -70px;
`;

const ContentBody = styled(CardBody)`
  display: flex;
  flex-direction: column;
`;

const Search = props => {
  // const [events, setEvents] = useState([]);
  const {
    events,
    venues,
    address,
    search,
    handleEventInputChange,
  } = useEventSearch();
  return (
    <ContentCard inverse color="dark">
      <ErrorBoundary>
        <CardBody>
          <SearchBar
            onChange={handleEventInputChange}
            address={address}
            placeholder="Enter your address..."
            search={search}
          />
          <LeafMap venues={venues} />
        </CardBody>
      </ErrorBoundary>
    </ContentCard>
  );
};
export default Search;
