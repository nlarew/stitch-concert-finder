import React from "react";
import styled from "@emotion/styled";
import { Router, Redirect } from "@reach/router";
import { Card, CardBody, Button } from "reactstrap";
import app from "./../stitch";

const AppCard = styled(Card)`
  width: 600px;
`;

const Hello = () => (
  <AppCard>
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  </AppCard>
);

const SearchBar = styled.input`
  width: 600px;
  height: 70px;
  background-color: white;
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 20px;
`;

const Search = props => {
  return <SearchBar placeholder="Enter your address..." />;
};

export default function App(props) {
  return (
    <Router>
      <Hello path="/" />
      <Search path="/search" />
      <Redirect default from="*" to="/search" />
    </Router>
  );
}
