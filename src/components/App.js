import React from "react";
import styled from "@emotion/styled";
import { Router } from "@reach/router";
import { Card, CardBody, Button } from "reactstrap";
import app from "./../stitch";

const AppCard = styled(Card)`
  width: 600px;
`;

const Hello = () => (
  <div className="App">
    <h1>Hello CodeSandbox</h1>
    <h2>Start editing to see some magic happen!</h2>
  </div>
);

const Foo = () => <div className="App">Foo</div>;

export default function App(props) {
  return (
    <AppCard>
      <Router>
        <Hello path="/" />
        <Foo path="/foo" />
      </Router>
    </AppCard>
  );
}
