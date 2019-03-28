import React, { useState } from "react";
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

const ContentCard = styled(Card)`
  grid-area: detail;
  margin: 10px;
  background-color: #383a3f !important;
  background-color: #3e4348 !important;
  background-color: #1f2124 !important;
  position: relative;
  top: -70px;
`;

function Venue({ venue }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  return (
    <ContentCard inverse>
      <ErrorBoundary>
        <CardBody>
          <CardTitle>
            <h1>{venue.name}</h1>
          </CardTitle>
          {venue.description && (
            <>
              <h2>Description</h2>
              <CardText>{venue.description}</CardText>
            </>
          )}
          <Button color="info">Button</Button>
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
