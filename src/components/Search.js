import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import ErrorBoundary from "react-error-boundary";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  InputGroup,
  Input,
  InputGroupAddon,
  Table,
} from "reactstrap";
import LeafMap from "./Map";

import app, { getLocationForAddress } from "./../stitch";
import {
  getNearbyEvents,
  getNearbyVenues,
} from "./../stitch/services/eventful";

import { Songkick } from "./../stitch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
const SearchIcon = () => <FontAwesomeIcon icon={faSearch} />;

const SearchBarContainer = styled(InputGroup)`
  width: 100%;
`;
const SearchBarButton = props => {
  const { handleSearch } = props;
  const Text = styled.div`
    margin-right: 8px;
    margin-left: 8px;
  `;
  return (
    <InputGroupAddon addonType="append">
      <Button color="info" onClick={handleSearch}>
        <Text>Search</Text>
        <SearchIcon />
      </Button>
    </InputGroupAddon>
  );
};
const SearchBarInput = styled(Input)`
  height: 70px !important;
  background-color: white;
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 20px;
  line-height: 40px;
`;
const SearchBar = React.memo(props => {
  const { address, searchFor, onChange } = props;
  const handleSearch = () => {
    searchFor(address);
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
      />
      <SearchBarButton handleSearch={handleSearch} />
    </SearchBarContainer>
  );
});

export function useEventSearch() {
  const [address, setAddress] = useState("");
  const [addressLocation, setAddressLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [searching, setSearching] = useState(false);
  const [fetchingEvents, setFetchingEvents] = useState(false);
  const [fetchingVenues, setFetchingVenues] = useState(false);

  const handleEventInputChange = e => {
    setAddress(e.currentTarget.value);
  };

  function search(addr) {
    setSearching(true);
    if (fetchingEvents || fetchingVenues) {
      cancelCurrentSearch();
    }
    setFetchingEvents(true);
    setFetchingVenues(true);
  }

  function cancelCurrentSearch() {
    setFetchingEvents(false);
    setFetchingVenues(false);
  }

  async function getAddressLocation(address) {
    console.log("address!", address);
    if (searching) {
      const {
        geometry: { location },
      } = await getLocationForAddress(address);
      console.log("location!", location);
      setAddressLocation(location);
    }
    setSearching(false);
  }

  useEffect(
    () => {
      getAddressLocation(address);
    },
    [searching],
  );

  function searchForEvents() {
    if (fetchingEvents) {
      const upcoming = Promise.resolve(getNearbyEvents())
        .then(result => result.events.event)
        .then(events => {
          console.log("events", events);
          setEvents(events);
          setFetchingEvents(false);
        });
      return () => upcoming.promiseStatus === "pending" && upcoming.reject();
    }
  }
  useEffect(searchForEvents, [fetchingEvents]);

  const [venues, setVenues] = useState([]);
  function searchForVenues() {
    if (fetchingVenues) {
      const upcoming = Promise.resolve(getNearbyVenues())
        .then(result => result.venues.venue)
        .then(venues => {
          console.log("venues", venues);
          setVenues(venues);
          setFetchingVenues(false);
        });
      return () => upcoming.promiseStatus === "pending" && upcoming.reject();
    }
  }
  useEffect(searchForVenues, [fetchingVenues]);

  return {
    events,
    venues,
    address,
    addressLocation,
    search,
    handleEventInputChange,
  };
}

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
  const {
    events,
    venues,
    address,
    addressLocation,
    search,
    handleEventInputChange,
  } = props;
  return (
    <ContentCard inverse color="dark">
      <ErrorBoundary>
        <ContentBody>
          <CardTitle>
            <h1>Search Nearby Venues</h1>
          </CardTitle>
          <SearchBar
            onChange={handleEventInputChange}
            address={address}
            placeholder="Enter your address..."
            searchFor={search}
          />
          <LeafMap venues={venues} addressLocation={addressLocation} />
        </ContentBody>
      </ErrorBoundary>
    </ContentCard>
  );
};
export default Search;
