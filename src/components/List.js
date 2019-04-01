/** @jsx jsx */
import React from "react";
import styled from "@emotion/styled";
import { css, jsx } from "@emotion/core";
import ErrorBoundary from "react-error-boundary";
import { Card, CardBody, CardHeader, Table } from "reactstrap";
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
  grid-area: list;
  margin: 10px;
  background-color: #383a3f !important;
  background-color: #3e4348 !important;
  background-color: #1f2124 !important;
  position: relative;
  top: -70px;
`;

const EventsTable = styled(Table)`
  flex-grow: 10;
`;

const EventsTableBody = styled.tbody`
  overflow-y: scroll;
`;

const EventsTableRow = styled("tr")`
  background-color: ${props => (props.isCurrent ? "#16a2b8" : "#3e4348")};
`;

const date2time = dateString => {
  const date = new Date(Date.parse(dateString));
  const hours = date.getHours();
  const minutes = String(date.getMinutes());

  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][date.getMonth()];
  const dayOfMonth = date.getDate();
  const period = hours <= 11 ? "AM" : "PM";
  const hour = period === "AM" ? hours : hours === 12 ? "12" : hours - 12;
  const minute = minutes.length > 1 ? minutes : minutes + "0";

  return `${month} ${dayOfMonth} ${hour}:${minute}${period}`;
};

const EventsList = props => {
  const { events, currentEvent, setCurrentEvent } = props;
  const rowClickHandler = event => e => {
    setCurrentEvent(event);
  };
  const renderEventRows = () => {
    return (
      events &&
      events
        .map(event => (
          <EventsTableRow
            key={event.id}
            onClick={rowClickHandler(event)}
            isCurrent={currentEvent && currentEvent.id === event.id}
          >
            <td><a href={event.url}>{event.name}</a></td>
          </EventsTableRow>
        ))
    );
  };
  return (
    <EventsTable dark>
      <thead>
        <tr>
          <th>Event</th>
        </tr>
      </thead>
      <EventsTableBody>{renderEventRows()}</EventsTableBody>
    </EventsTable>
  );
};

const VenuesList = props => {
  const { venues, currentVenue, setCurrentVenue, currentUserProfile } = props;
  const rowClickHandler = event => e => {
    setCurrentVenue(event);
  };
  const renderVenueRows = () => {
    return (
      venues &&
      venues
        .filter((v, i) => i < 20)
        .map(venue => {
          console.log('venue', venue.upcomingEvents.length, venue.upcomingEvents, venue)
          const isFavorite = currentUserProfile && currentUserProfile.favoriteVenues.includes(venue.id)
          return (
            <EventsTableRow
              key={venue.id}
              onClick={rowClickHandler(venue)}
              isCurrent={currentVenue && currentVenue.id === venue.id}
            >
              <td>
                {isFavorite && <StarIcon />}
              </td>
              <td>
                <span>{venue.name}</span>
              </td>
              <td>{venue.upcomingEvents.length || 0}</td>
            </EventsTableRow>
          );
        })
    );
  };
  return (
    <EventsTable dark>
      <thead>
        <tr>
          <th></th>
          <th>Venue</th>
          <th># Shows</th>
        </tr>
      </thead>
      <EventsTableBody>{renderVenueRows()}</EventsTableBody>
    </EventsTable>
  );
};

const headerStyle = css`
  min-height: 165px;
`

function List(props) {
  const { address = "You", currentUserProfile } = props;
  return (
    <ContentCard inverse>
      <ErrorBoundary>
        <CardBody>
          <CardHeader css={headerStyle}>
            <h1>Venues Near...</h1>
            <h2>{address}</h2>
          </CardHeader>
          <VenuesList {...props} currentUserProfile={currentUserProfile} />
        </CardBody>
      </ErrorBoundary>
    </ContentCard>
  );
}
export default List;
export { EventsList };
