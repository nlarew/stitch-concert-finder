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
import * as mongodbActions from "./../stitch/mongodb";
import * as R from 'ramda';

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
const SearchBarButton = ({ onButtonPress, isSearching }) => {
  return (
    <InputGroupAddon addonType="append">
      <Button color="info" onClick={onButtonPress} disabled={isSearching}>
        <div css={css`
          margin-right: 8px;
          margin-left: 8px;
        `}>
          {isSearching ? "Searching"     : "Search"}
          {isSearching ? <SpinnerIcon /> : <SearchIcon />}
        </div>
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

export const SearchBar = React.memo(props => {
  const { handleSearch, isSearching } = props;
  const [searchString, setSearchString] = useState("");
  const handleInputChange = e => setSearchString(e.currentTarget.value)
  const search = () => handleSearch(searchString);
  const handleKeyPress = e => e.keyCode === 13 && search();

  return (
    <SearchBarContainer>
      <SearchBarInput
        onChange={handleInputChange}
        invalid={false /*venuesError*/}
        disabled={isSearching}
        onKeyDown={handleKeyPress}
        value={searchString}
        placeholder="123 Cherry Lane"
      />
      <SearchBarButton onButtonPress={search} isSearching={isSearching} />
    </SearchBarContainer>
  );
});

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
    setVenues,
    addressQuery,
    addressLocation,
    search,
    searching,
    handleInputChange,
    currentVenue,
    setCurrentVenue,
    setAddress,
    setAddressLocation,
    venuesError,
    orderedVenues,
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
              venuesError={venuesError}
            />
          </CardHeader>
          <LeafMap
            venues={orderedVenues}
            center={coords}
            currentVenue={currentVenue}
            setCurrentVenue={setCurrentVenue}
            isSearching={searching}
          />
        </ContentBody>
      </ErrorBoundary>
    </ContentCard>
  );
};
export default Search;
