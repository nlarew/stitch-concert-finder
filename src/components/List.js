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
    // <td>{event.start.date}</td>
    // <td>{event.displayName}</td>
    // <td>{event.performance[0].artist.displayName}</td>
    // <td>{event.venue.displayName}</td>
    // <td>{event.start.time}</td>
    return (
      events &&
      events
        .filter((e, i) => i < 3)
        .map(event => (
          <EventsTableRow
            key={event.id}
            onClick={rowClickHandler(event)}
            isCurrent={currentEvent && currentEvent.id === event.id}
          >
            <td>{event.id}</td>
            <td>{event.name}</td>
            <td>{event.url}</td>
          </EventsTableRow>
        ))
    );
  };
  return (
    <EventsTable dark>
      <thead>
        <tr>
          <th>Date</th>
          <th>Event</th>
          <th>Venue</th>
        </tr>
      </thead>
      <EventsTableBody>{renderEventRows()}</EventsTableBody>
    </EventsTable>
  );
};

const VenuesList = props => {
  const { venues, currentVenue, setCurrentVenue } = props;
  const rowClickHandler = event => e => {
    setCurrentVenue(event);
  };
  const renderVenueRows = () => {
    return (
      venues &&
      venues
        .filter((v, i) => i < 20)
        .map(venue => {
          return (
            <EventsTableRow
              key={venue.id}
              onClick={rowClickHandler(venue)}
              isCurrent={currentVenue && currentVenue.id === venue.id}
            >
              <td>
                <span>{venue.name}</span>
                <StarIcon />
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
          <th>Venue</th>
          <th># Shows</th>
        </tr>
      </thead>
      <EventsTableBody>{renderVenueRows()}</EventsTableBody>
    </EventsTable>
  );
};

function List(props) {
  const { address = "You", listOf } = props;
  const Table = {
    events: EventsList,
    venues: VenuesList,
  }[listOf];
  return (
    <ContentCard inverse>
      <ErrorBoundary>
        <CardBody>
          <CardHeader>
            <h1>Venunes Near...</h1>
            <h2>{address}</h2>
          </CardHeader>
          <Table {...props} />
        </CardBody>
      </ErrorBoundary>
    </ContentCard>
  );
}
export default List;
export { EventsList };
