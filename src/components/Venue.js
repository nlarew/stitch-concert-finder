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
`;

const VenueLayout = styled.div`
  display: grid;
  grid-template-areas:
    "navbar"
    "content";
  grid-template-rows: 60px 1fr;
  height: 100%;
  background: #1f2124;
`;

function Venue(props) {
  return (
    <ErrorBoundary>
      <VenueLayout>
        <Navbar />
        <ContentCard inverse>
          <CardImg
            top
            width="100%"
            src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
            alt="Card image cap"
          />
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
