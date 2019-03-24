import React from "react";
import styled from "@emotion/styled";
import ErrorBoundary from "react-error-boundary";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardFooter,
  CardText,
  Button,
  Table,
} from "reactstrap";
import Navbar from "./Navbar";
import Banner from "./Banner";

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
  background-color: ${props => (props.isCurrent ? "#ff0000" : "#00ff00")};
`;

const EventsList = props => {
  const { events, currentEvent, setCurrentEvent } = props;
  const rowClickHandler = event => e => {
    setCurrentEvent(event);
  };
  const renderEventRows = () => {
    return (
      events &&
      events.map(event => (
        <EventsTableRow
          key={event.id}
          onClick={rowClickHandler(event)}
          isCurrent={currentEvent && currentEvent.id === event.id}
        >
          <td>{event.start.date}</td>
          <td>{event.displayName}</td>
          <td>{event.performance[0].artist.displayName}</td>
          <td>{event.venue.displayName}</td>
          <td>{event.start.time}</td>
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
          <th>Artist</th>
          <th>Venue</th>
          <th>Time</th>
        </tr>
      </thead>
      <EventsTableBody>{renderEventRows()}</EventsTableBody>
    </EventsTable>
  );
};

const SongkickLogo = () => (
  <a href="https://www.songkick.com/">
    <img
      height="30px"
      src="https://stitch-statichosting-prod.s3.amazonaws.com/5c95208750626e9adb7c1723/powered-by-songkick-white.svg"
    />
  </a>
);

function List(props) {
  const address = props.address || "You";
  return (
    <ContentCard inverse>
      <ErrorBoundary>
        <CardBody>
          <CardTitle>
            <h1>Events Near {address}</h1>
          </CardTitle>
          <EventsList {...props} />
        </CardBody>
        <CardFooter>
          <SongkickLogo />
        </CardFooter>
      </ErrorBoundary>
    </ContentCard>
  );
}
export default List;
