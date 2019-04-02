import React from "react";
import styled from "@emotion/styled";
import ErrorBoundary from "react-error-boundary";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Button,
} from "reactstrap";

const ContentCard = styled(Card)`
  grid-area: detail;
  margin: 10px;
  background-color: #383a3f !important;
  background-color: #3e4348 !important;
  background-color: #1f2124 !important;
  position: relative;
  top: -70px;
`;

function Event(props) {
  const { displayName } = props.event;
  return (
    <ContentCard inverse>
      <ErrorBoundary>
        <CardBody>
          <CardTitle>
            <h1>{displayName || "asdf"}</h1>
          </CardTitle>
          <CardSubtitle>Card subtitle</CardSubtitle>
          <CardText>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </CardText>
          <Button color="info">Button</Button>
        </CardBody>
      </ErrorBoundary>
    </ContentCard>
  );
}
export default Event;
