/** @jsx jsx */
import React, { useState } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import ErrorBoundary from "react-error-boundary";
import {
  Card,
  CardBody,
  CardHeader,
  CardText,
  Button,
  UncontrolledTooltip,
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

const FavoriteButton = ({ isFavorite, handleButtonClick, isGuest }) => {
  return (
    <Button
      css={css`margin: auto 4px;`}
      outline={!isFavorite}
      color="warning"
      onClick={handleButtonClick}
      disabled={isGuest}
    >
      <StarIcon />
      <span id="addFavoriteVenu">
        {isFavorite ? "Favorited" : "Add to Favorites"}
      </span>
      {isGuest && (
        <UncontrolledTooltip placement="bottom" target="addFavoriteVenu" >
          Must log in to add a favorite!
        </UncontrolledTooltip>
      )}
    </Button>
  );
};

const headerStyle = css`
  min-height: 165px;
  padding-left: 0px;
  padding-right: 0px;
`

export default React.memo(function({ venue, currentUserProfile, actions }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [settingFavorite, setSettingFavorite] = useState(false);
  const isFavorite = currentUserProfile && currentUserProfile.favoriteVenues.includes(venue.id)
  return (
    <ContentCard inverse>
      <ErrorBoundary>
        <CardBody>
          <CardHeader css={headerStyle}>
            <h1>{venue.name}</h1>
            <FavoriteButton
              isFavorite={isFavorite}
              disabled={settingFavorite}
              isGuest={currentUserProfile && currentUserProfile.isGuest}
              handleButtonClick={() => {
                setSettingFavorite(true)
                const { addFavoriteVenue, removeFavoriteVenue } = actions
                const handle = isFavorite ? removeFavoriteVenue : addFavoriteVenue
                handle(venue.id).then(() => setSettingFavorite(!settingFavorite))
              }}
            />
          </CardHeader>
          {venue.description && <CardText dangerouslySetInnerHTML={{ __html: venue.description }} />}
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
})
