import React from "react";
import styled from "@emotion/styled";
import ErrorBoundary from "react-error-boundary";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Button,
} from "reactstrap";
import Navbar from "./Navbar";
import Banner from "./Banner";

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
  return (
    <ContentCard inverse>
      <ErrorBoundary>
        <CardBody>
          <CardTitle>
            <h1>{venue.name}</h1>
          </CardTitle>
          <h2>Description</h2>
          {venue.description && <CardText>{venue.description}</CardText>}
          <Button color="info">Button</Button>
        </CardBody>
      </ErrorBoundary>
    </ContentCard>
  );
}
export default Venue;
