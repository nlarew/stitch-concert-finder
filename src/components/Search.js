/** @jsx jsx */
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { jsx, css } from "@emotion/core";
import ErrorBoundary from "react-error-boundary";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  InputGroup,
  Input,
  InputGroupAddon,
} from "reactstrap";
import LeafMap from "./Map";
import { searchNearAddress } from "./../stitch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import * as R from 'ramda'

import keapVenues from "./../stitch/services/stubs/487keapVenues.json";
import keapLocation from "./../stitch/services/stubs/487keapLocation.json";

const SearchIcon = () => (
  <FontAwesomeIcon
    icon={faSearch}
    css={css`margin: auto 4px;`}
  />
);

const SpinnerIcon = () => (
  <FontAwesomeIcon
    spin
    icon={faSpinner}
    css={css`margin: auto 4px;`}
  />
);

const SearchBarContainer = styled(InputGroup)`
  width: 100%;
`;
const SearchBarButton = props => {
  const { handleSearch, isSearching } = props;
  const Text = styled.div`
    margin-right: 8px;
    margin-left: 8px;
  `;
  return (
    <InputGroupAddon addonType="append">
      <Button color="info" onClick={handleSearch} disabled={isSearching}>
        {isSearching ? (
          <Text>Searching <SpinnerIcon /></Text>
        ) : (
          <>
              <Text>Search <SearchIcon /></Text>
          </>
        )}
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
  const {
    address,
    searchFor,
    onChange,
    isSearching,
    setVenues,
    setAddressLocation,
    setAddress,
  } = props;
  const handleSearch = () => {
    if (!isSearching) { searchFor(address) }
  };
  function handleKeyPress(e){
    if(e.keyCode == 13){
      handleSearch()
    }
  }
  return (
    <SearchBarContainer>
      <SearchBarInput
        onChange={onChange}
        onKeyDown={handleKeyPress}
        value={address}
        placeholder="Enter your address..."
        disabled={isSearching}
      />
      <Button
        onClick={() => {
          setVenues(keapVenues);
          setAddress(keapLocation.formatted_address);
          setAddressLocation(keapLocation);
        }}
      >
        Get Keap
      </Button>
      <SearchBarButton
        handleSearch={handleSearch}
        isSearching={isSearching}
      />
    </SearchBarContainer>
  );
});

export function useVenues() {
  const [address, setAddress] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [addressLocation, setAddressLocation] = useState(null);
  const [searching, setSearching] = useState(false);
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);

  const handleInputChange = e => {
    setAddressQuery(e.currentTarget.value);
  };

  const search = () => !searching && setSearching(true);
  async function handleSearch() {
    if (searching) {
      const result = await searchNearAddress(addressQuery);
      setAddress(result.location.formatted_address);
      setAddressLocation(result.location);
      setVenues(result.venues);
      setEvents(result.events);
      setSearching(false);
    }
  }
  useEffect(
    () => {
      handleSearch();
    },
    [searching],
  );

  return {
    events,
    venues,
    setVenues,
    setAddress,
    setAddressLocation,
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

const headerStyle = css`
  min-height: 165px;
  padding-left: 0px;
  padding-right: 0px;
`

const Search = props => {
  const {
    venues,
    setVenues,
    addressQuery,
    addressLocation,
    search,
    searching,
    handleInputChange,
    setCurrentVenue,
    setAddress,
    setAddressLocation,
  } = props;
  const coords = addressLocation && addressLocation.geometry.location;
  return (
    <ContentCard inverse color="dark">
      <ErrorBoundary>
        <ContentBody>
          <CardHeader css={headerStyle}>
            <h1>Search Nearby Venues</h1>
            <SearchBar
              onChange={handleInputChange}
              address={addressQuery}
              placeholder="Enter your address..."
              searchFor={search}
              isSearching={searching}
              setVenues={setVenues}
              setAddress={setAddress}
              setAddressLocation={setAddressLocation}
            />
          </CardHeader>
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
