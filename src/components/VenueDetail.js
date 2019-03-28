/** @jsx jsx */
import React, { useState } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import ErrorBoundary from "react-error-boundary";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardHeader,
  CardSubtitle,
  CardText,
  Button,
} from "reactstrap";
import { EventsList } from "./List";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const StarIcon = () => (
  <FontAwesomeIcon
    css={css`
      margin: auto 8px;
    `}
    icon={faStar}
  />
);

const ContentCard = styled(Card)`
  grid-area: detail;
  margin: 10px;
  background-color: #383a3f !important;
  background-color: #3e4348 !important;
  background-color: #1f2124 !important;
  position: relative;
  top: -70px;
`;

const FavoriteButton = ({ isFavorite }) => {
  const buttonStyle = css`
    margin: auto 4px;
  `;
  return (
    <Button css={buttonStyle} outline={isFavorite} color="warning">
      <StarIcon />
      <span>{isFavorite ? "Favorited" : "Add to Favorites"}</span>
    </Button>
  );
};

function Venue({ venue }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  return (
    <ContentCard inverse>
      <ErrorBoundary>
        <CardBody>
          <CardHeader>
            <h1>{venue.name}</h1>
            <FavoriteButton />
            <FavoriteButton isFavorite />
          </CardHeader>
          {venue.description && <CardText>{venue.description}</CardText>}
          {venue.upcomingEvents && (
            <EventsList
              events={venue.upcomingEvents}
              currentEvent={selectedEvent}
              setCurrentEvent={setSelectedEvent}
            />
          )}
        </CardBody>
      </ErrorBoundary>
    </ContentCard>
  );
}
export default Venue;
