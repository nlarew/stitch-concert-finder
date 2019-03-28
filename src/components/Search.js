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
import app, { getLocationForAddress, searchNearAddress } from "./../stitch";
import {
  getNearbyEvents,
  getNearbyVenues,
} from "./../stitch/services/eventful";
import * as R from "ramda";
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
  const [addressQuery, setAddressQuery] = useState("");
  const [addressLocation, setAddressLocation] = useState(null);
  const [searching, setSearching] = useState(false);
  const [events, setEvents] = useState([]);
  const [fetchingEvents, setFetchingEvents] = useState(false);
  const [venues, setVenues] = useState([]);
  const [fetchingVenues, setFetchingVenues] = useState(false);

  const handleInputChange = e => {
    setAddressQuery(e.currentTarget.value);
  };

  function search(addr) {
    if (searching || fetchingEvents || fetchingVenues) {
      cancelCurrentSearch();
    }
    setSearching(true);
    setFetchingEvents(true);
    setFetchingVenues(true);
  }

  function cancelCurrentSearch() {
    setSearching(false);
    setFetchingEvents(false);
    setFetchingVenues(false);
  }

  useEffect(
    () => {
      if (searching && !(fetchingEvents || fetchingVenues)) {
        setSearching(false);
      }
    },
    [searching, fetchingEvents, fetchingVenues],
  );

  async function geolocateAddress() {
    if (searching) {
      const location = await getLocationForAddress(addressQuery);
      setAddressLocation(location);
      setAddress(location.formatted_address);
    }
  }
  useEffect(
    () => {
      geolocateAddress();
    },
    [searching],
  );

  function searchForEvents() {
    if (fetchingEvents) {
      Promise.resolve(getNearbyEvents())
        .then(result => result.events.event)
        .then(events => {
          setEvents(events);
          setFetchingEvents(false);
        });
    }
  }
  useEffect(searchForEvents, [fetchingEvents]);

  function searchForVenues() {
    if (fetchingVenues) {
      console.log(addressQuery);
      searchNearAddress(addressQuery).then(venues => {
        console.log("venues", venues);
        setVenues(venues);
        setFetchingVenues(false);
      });
    }
  }
  useEffect(searchForVenues, [fetchingVenues]);

  return {
    events,
    venues,
    address,
    addressQuery,
    addressLocation,
    search,
    searching,
    handleInputChange,
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
    venues,
    addressQuery,
    addressLocation,
    search,
    searching,
    handleInputChange,
    setCurrentVenue,
  } = props;
  const coords = addressLocation && addressLocation.geometry.location;
  return (
    <ContentCard inverse color="dark">
      <ErrorBoundary>
        <ContentBody>
          <CardTitle>
            <h1>Search Nearby Venues</h1>
          </CardTitle>
          <SearchBar
            onChange={handleInputChange}
            address={addressQuery}
            placeholder="Enter your address..."
            searchFor={search}
          />
          <LeafMap
            venues={venues}
            center={coords}
            setCurrentVenue={setCurrentVenue}
            searching={searching}
          />
        </ContentBody>
      </ErrorBoundary>
    </ContentCard>
  );
};
export default Search;
