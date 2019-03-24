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
  margin: 10px;
  padding: 10px;
  background-color: #383a3f !important;
  background-color: #1f2124 !important;
  position: relative;
  top: -30px;
`;

const VenueLayout = styled.div`
  display: grid;
  grid-template-areas:
    "banner"
    "content";
  grid-template-rows: 140px 1fr;
  height: 100%;
  background: #1f2124;
`;

function Venue(props) {
  return (
    <ErrorBoundary>
      <VenueLayout>
        <Banner>
          <Navbar />
        </Banner>
        <ContentCard inverse>
          <CardBody>
            <CardTitle>
              <h1>MyVenue</h1>
            </CardTitle>
            <CardSubtitle>Card subtitle</CardSubtitle>
            <CardText>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </CardText>
            <Button>Button</Button>
          </CardBody>
        </ContentCard>
      </VenueLayout>
    </ErrorBoundary>
  );
}
export default Venue;
